import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Newspaper, Target, ClipboardCheck, Calendar, FolderOpen, Info, ExternalLink, UserPlus, Check, PlayCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CourseTabs } from '@/components/course/CourseTabs';
import { InstructorCard } from '@/components/course/InstructorCard';
import { ScheduleTable } from '@/components/course/ScheduleTable';
import { AssessmentTable } from '@/components/course/AssessmentTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getCourseById } from '@/data/academicCourses';
import { QuizCard } from '@/components/quiz/QuizCard';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { VideoPlayer } from '@/components/video/VideoPlayer';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'news', label: 'News' },
  { id: 'outcomes', label: 'Learning Outcomes' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'quizzes', label: 'Quizzes' },
  { id: 'resources', label: 'Course Resources' },
  { id: 'general', label: 'General Resources' },
];

const AcademicCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [dbCourseId, setDbCourseId] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<Record<string, any>>({});
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const course = getCourseById(courseId || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Check if user is enrolled and get DB course ID
  useEffect(() => {
    if (user && course) {
      checkEnrollmentStatus();
    }
  }, [user, course]);

  // Fetch quizzes when we have the db course id
  useEffect(() => {
    if (dbCourseId) {
      fetchQuizzes();
      fetchScheduleItems();
    }
  }, [dbCourseId]);

  const checkEnrollmentStatus = async () => {
    if (!course) return;

    try {
      // First check if course exists in DB
      const { data: dbCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('code', course.code)
        .maybeSingle();

      if (dbCourse) {
        setDbCourseId(dbCourse.id);

        // Check enrollment
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user?.id)
          .eq('course_id', dbCourse.id)
          .maybeSingle();

        setIsEnrolled(!!enrollment);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const fetchQuizzes = async () => {
    if (!dbCourseId) return;

    try {
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', dbCourseId)
        .eq('is_published', true)
        .order('created_at');

      setQuizzes(quizzesData || []);

      // Fetch user's attempts
      if (user && quizzesData && quizzesData.length > 0) {
        const quizIds = quizzesData.map(q => q.id);
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', user.id)
          .in('quiz_id', quizIds)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false });

        // Get best attempt per quiz
        const attemptsMap: Record<string, any> = {};
        (attempts || []).forEach(attempt => {
          if (!attemptsMap[attempt.quiz_id] || attempt.percentage > attemptsMap[attempt.quiz_id].percentage) {
            attemptsMap[attempt.quiz_id] = attempt;
          }
        });
        setQuizAttempts(attemptsMap);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchScheduleItems = async () => {
    if (!dbCourseId) return;

    try {
      const { data } = await supabase
        .from('schedule_items')
        .select('*')
        .eq('course_id', dbCourseId)
        .order('sort_order');

      setScheduleItems(data || []);
    } catch (error) {
      console.error('Error fetching schedule items:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!course) return;

    setEnrolling(true);

    try {
      let courseDbId = dbCourseId;

      // If course doesn't exist in DB, create it
      if (!courseDbId) {
        const { data: newCourse, error: courseError } = await supabase
          .from('courses')
          .insert({
            code: course.code,
            title: course.title,
            description: course.description,
            semester: course.semester,
            prerequisites: course.prerequisites,
            instructor_name: course.instructor.name,
            instructor_email: course.instructor.email,
            schedule_days: course.schedule.days,
            schedule_time: course.schedule.time,
            office_hours: course.instructor.officeHours,
            textbooks: course.textbooks,
            is_published: true
          })
          .select('id')
          .single();

        if (courseError) throw courseError;
        courseDbId = newCourse.id;
        setDbCourseId(courseDbId);
      }

      // Enroll user
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseDbId
        });

      if (enrollError) {
        if (enrollError.message.includes('duplicate')) {
          setIsEnrolled(true);
          toast({ title: 'Already enrolled', description: 'You are already enrolled in this course.' });
          return;
        }
        throw enrollError;
      }

      setIsEnrolled(true);
      toast({
        title: 'Enrolled successfully!',
        description: `You are now enrolled in ${course.code}.`,
      });
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        variant: 'destructive',
        title: 'Enrollment failed',
        description: error.message,
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Course Header */}
      <div className="border-b border-border/30 bg-gradient-hero">
        <div className="container px-4 md:px-6 py-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            All Courses
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-start gap-3 mb-2">
                <Badge variant="outline" className="border-primary/50 text-primary font-mono text-base px-3 py-1">
                  {course.code}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {course.title}
              </h1>
              
              <p className="text-lg text-primary font-medium">
                {course.semester}
              </p>
            </div>

            <div className="flex-shrink-0">
              {isEnrolled ? (
                <Button disabled className="bg-course-complete text-white">
                  <Check className="h-4 w-4 mr-2" />
                  Enrolled
                </Button>
              ) : (
                <Button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-gradient-primary shadow-glow"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <CourseTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content */}
      <div className="container px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <section className="animate-fade-in">
                <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <Info className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-semibold">Prerequisites:</span>{' '}
                    <span className="text-muted-foreground">{course.prerequisites}</span>
                  </p>
                </div>
              </section>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">News</h2>
                </div>
                
                <div className="space-y-4">
                  {course.news.map((item, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex-shrink-0 text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-md h-fit">
                        {item.date}
                      </div>
                      <p className="text-foreground/90">{item.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Learning Outcomes Tab */}
            {activeTab === 'outcomes' && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Learning Outcomes</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  This course has {course.learningOutcomes.length} learning outcomes:
                </p>
                
                <div className="space-y-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <div 
                      key={outcome.id}
                      className="flex gap-4 p-4 rounded-lg bg-card border border-border/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-primary">{outcome.id}:</span>{' '}
                        <span className="text-foreground/90">{outcome.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Assessment Tab */}
            {activeTab === 'assessment' && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Assessment</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  This course involves assignments, activities, and a semester-long project. 
                  Final course grades will be based on the following:
                </p>
                
                <AssessmentTable assessments={course.assessment} />
              </section>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Tentative Schedule</h2>
                </div>
                
                <ScheduleTable schedule={course.tentativeSchedule} />

                {/* Videos from schedule items */}
                {scheduleItems.filter(item => item.video_url).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      Lecture Videos
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {scheduleItems.filter(item => item.video_url).map((item) => (
                        <Card key={item.id} className="cursor-pointer hover:border-primary/50" onClick={() => setSelectedVideo(item)}>
                          <CardContent className="p-4">
                            <p className="font-medium">{item.chapter}: {item.topic}</p>
                            <p className="text-sm text-muted-foreground mt-1">Click to watch</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Quizzes</h2>
                </div>
                
                {!user ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">Sign in to take quizzes</p>
                      <Button onClick={() => navigate('/auth')}>Sign In</Button>
                    </CardContent>
                  </Card>
                ) : quizzes.length === 0 ? (
                  <p className="text-muted-foreground">No quizzes available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        attempt={quizAttempts[quiz.id]}
                        onStart={() => setSelectedQuiz(quiz)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Course Resources Tab */}
            {activeTab === 'resources' && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Course Resources</h2>
                </div>
                
                {course.resources.length > 0 ? (
                  <div className="space-y-6">
                    {course.resources.map((resource, index) => (
                      <Card key={index} className="bg-card/50 border-border/50">
                        <CardHeader>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{resource.description}</p>
                          {resource.links && (
                            <div className="flex flex-wrap gap-2">
                              {resource.links.map((link, i) => (
                                <a 
                                  key={i}
                                  href={link.url}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  {link.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No course resources available yet.</p>
                )}

                {/* Textbooks */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Textbooks
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    There is no required textbook for this course. However, students who wish to read more about the topics that we discuss in class may consult the following textbooks:
                  </p>
                  <ul className="space-y-2">
                    {course.textbooks.map((book, index) => (
                      <li key={index} className="flex items-start gap-2 text-foreground/90">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        {book}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* General Resources Tab */}
            {activeTab === 'general' && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Info className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">General Resources</h2>
                </div>
                
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Academic Integrity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Students are expected to know and abide by the university's policies on academic integrity. 
                      Academic integrity violations will be prosecuted aggressively. If you are not sure what 
                      constitutes an academic integrity violation, please ask.
                    </p>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <InstructorCard instructor={course.instructor} schedule={course.schedule} />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedQuiz && (
            <QuizPlayer
              quizId={selectedQuiz.id}
              title={selectedQuiz.title}
              timeLimitMinutes={selectedQuiz.time_limit_minutes}
              onComplete={() => fetchQuizzes()}
              onClose={() => setSelectedQuiz(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          {selectedVideo && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{selectedVideo.chapter}: {selectedVideo.topic}</h3>
              <VideoPlayer
                videoUrl={selectedVideo.video_url}
                videoType={selectedVideo.video_type || 'youtube'}
                title={selectedVideo.topic}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcademicCoursePage;
