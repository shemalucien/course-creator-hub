import { Calendar, Clock, Mail, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Instructor, CourseSchedule } from '@/data/academicCourses';

interface InstructorCardProps {
  instructor: Instructor;
  schedule: CourseSchedule;
}

export function InstructorCard({ instructor, schedule }: InstructorCardProps) {
  return (
    <Card className="bg-card/80 border-border/50">
      <CardContent className="p-5 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Lectures
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{schedule.days}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>{schedule.time}</span>
          </div>
        </div>

        <div className="border-t border-border/50 pt-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Instructor
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{instructor.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Mail className="h-4 w-4 text-primary" />
            <a href={`mailto:${instructor.email}`} className="text-primary hover:underline">
              {instructor.email}
            </a>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Office Hours
            </p>
            {instructor.officeHours.map((hours, i) => (
              <p key={i} className="text-sm text-muted-foreground">{hours}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
