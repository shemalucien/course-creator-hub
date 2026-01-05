import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { academicCourses } from '@/data/academicCourses';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        </div>
        
        <div className="container relative px-4 py-16 md:py-20">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary animate-fade-in">
              <BookOpen className="h-3 w-3 mr-1" />
              Academic Course Portal
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-slide-up">
              Course <span className="text-gradient">Materials</span>
            </h1>
            
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
              Access course syllabi, schedules, assignments, and resources for all your enrolled courses.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold mb-8">Available Courses</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicCourses.map((course, index) => (
            <Link 
              key={course.id}
              to={`/course/${course.id}`}
              className="group block animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full bg-card border-border/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="font-mono border-primary/30 text-primary">
                      {course.code}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{course.semester}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{course.instructor.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/30">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
                <BookOpen className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold">CoursePortal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Academic Course Portal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
