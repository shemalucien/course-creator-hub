import { Link } from 'react-router-dom';
import { BookOpen, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { academicCourses } from '@/data/academicCourses';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Course<span className="text-primary">Portal</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {academicCourses.slice(0, 4).map(course => (
              <Link 
                key={course.id}
                to={`/course/${course.id}`} 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
              >
                {course.code}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card">
            <nav className="flex flex-col gap-2 mt-8">
              {academicCourses.map(course => (
                <Link 
                  key={course.id}
                  to={`/course/${course.id}`} 
                  className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                >
                  {course.code} - {course.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
