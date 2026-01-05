import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Newspaper, Target, ClipboardCheck, Calendar, FolderOpen, Info, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CourseTabs } from '@/components/course/CourseTabs';
import { InstructorCard } from '@/components/course/InstructorCard';
import { ScheduleTable } from '@/components/course/ScheduleTable';
import { AssessmentTable } from '@/components/course/AssessmentTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCourseById } from '@/data/academicCourses';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'news', label: 'News' },
  { id: 'outcomes', label: 'Learning Outcomes' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'resources', label: 'Course Resources' },
  { id: 'general', label: 'General Resources' },
];

const AcademicCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  const course = getCourseById(courseId || '');

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
      </div>

      {/* Tabs Navigation */}
      <CourseTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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
    </div>
  );
};

export default AcademicCoursePage;
