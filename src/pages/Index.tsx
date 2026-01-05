import { useState } from 'react';
import { Search, Filter, GraduationCap, TrendingUp, Award } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CourseCard } from '@/components/courses/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { courses, categories } from '@/data/courses';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        
        <div className="container relative px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary animate-fade-in">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trusted by 10,000+ learners worldwide
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
              Master <span className="text-gradient">Technology</span>
              <br />One Course at a Time
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Expert-led courses in distributed systems, machine learning, cloud architecture, 
              and more. Learn at your own pace with hands-on projects.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="What do you want to learn?" 
                  className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-gradient-primary hover:opacity-90 shadow-glow">
                Explore Courses
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-muted-foreground animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-sm">{courses.length}+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm">Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="container px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse All Courses</h2>
            <p className="text-muted-foreground">
              {filteredCourses.length} courses available
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-gradient-primary" : ""}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/30">
        <div className="container px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">LearnHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LearnHub. Empowering learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
