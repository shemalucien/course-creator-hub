import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  CheckCircle2,
  PlayCircle,
  BarChart3
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ChapterAccordion } from '@/components/courses/ChapterAccordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCourseById } from '@/data/courses';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getCourseById(courseId || '');

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedLessons = course.chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter(l => l.completed).length, 
    0
  );
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-10 right-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative px-4 py-12 md:py-16">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {course.category}
                </Badge>
                <Badge variant="secondary">{course.level}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 animate-fade-in">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium text-foreground">{course.rating}</span>
                  <span>rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolledStudents.toLocaleString()} students</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 sticky top-24">
                <CardContent className="p-6">
                  <div className="aspect-video rounded-lg bg-gradient-card flex items-center justify-center mb-6 overflow-hidden relative group cursor-pointer">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <Button className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 shadow-glow mb-4">
                    Start Learning
                  </Button>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Chapters</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {course.chapters.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        {totalLessons}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </div>

                  {progressPercent > 0 && (
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Your Progress</span>
                        <span className="text-sm font-medium text-primary">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="container px-4 py-12 md:py-16">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Course Curriculum</h2>
              <p className="text-muted-foreground">
                {course.chapters.length} chapters • {totalLessons} lessons
              </p>
            </div>
          </div>

          <ChapterAccordion chapters={course.chapters} />

          {/* What You'll Learn */}
          <div className="mt-12 pt-12 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {course.tags.map((tag, index) => (
                <div 
                  key={tag} 
                  className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{tag} concepts and practical applications</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
