import { Link } from 'react-router-dom';
import { BookOpen, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Learn<span className="text-gradient">Hub</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
              className="pl-9 bg-secondary/50 border-border/50 focus:bg-secondary"
            />
          </div>

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-card">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-9" />
                </div>
                <Link to="/" className="text-lg font-medium py-2 hover:text-primary transition-colors">
                  Courses
                </Link>
                <Link to="/" className="text-lg font-medium py-2 hover:text-primary transition-colors">
                  Categories
                </Link>
                <Link to="/" className="text-lg font-medium py-2 hover:text-primary transition-colors">
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
