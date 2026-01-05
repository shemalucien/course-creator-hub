import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

  return (
    <Link 
      to={`/course/${course.id}`}
      className="group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card className="overflow-hidden bg-card border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-glow animate-fade-in">
        <div className="relative aspect-video overflow-hidden bg-gradient-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-sm"
          >
            {course.level}
          </Badge>
        </div>

        <CardContent className="p-5">
          <Badge variant="outline" className="mb-3 text-xs border-primary/30 text-primary">
            {course.category}
          </Badge>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{totalLessons} lessons</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{course.enrolledStudents.toLocaleString()} students</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
