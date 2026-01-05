import { FileText, ClipboardList, Download, ExternalLink, Presentation } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ScheduleItem } from '@/data/academicCourses';

interface ScheduleTableProps {
  schedule: ScheduleItem[];
}

function getResourceIcon(type: string) {
  switch (type) {
    case 'assignment':
      return <ClipboardList className="h-3.5 w-3.5" />;
    case 'activity':
      return <FileText className="h-3.5 w-3.5" />;
    case 'template':
      return <Download className="h-3.5 w-3.5" />;
    case 'link':
      return <ExternalLink className="h-3.5 w-3.5" />;
    default:
      return <FileText className="h-3.5 w-3.5" />;
  }
}

function getResourceVariant(type: string): "default" | "secondary" | "outline" | "destructive" {
  switch (type) {
    case 'assignment':
      return 'default';
    case 'activity':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead className="w-20 font-semibold">Chapter</TableHead>
            <TableHead className="font-semibold">Topic</TableHead>
            <TableHead className="font-semibold">Notes</TableHead>
            <TableHead className="font-semibold">Assignments/Activities/Templates</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((item, index) => (
            <TableRow key={index} className="hover:bg-secondary/20">
              <TableCell className="font-medium text-primary">{item.chapter}</TableCell>
              <TableCell>
                <a 
                  href={item.slideUrl || '#'}
                  download
                  className="group inline-flex items-center gap-2 font-medium text-foreground hover:text-primary transition-colors"
                  onClick={(e) => {
                    if (!item.slideUrl) {
                      e.preventDefault();
                      alert('Slides will be available soon!');
                    }
                  }}
                >
                  <Presentation className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="border-b border-dashed border-muted-foreground/50 group-hover:border-primary">
                    {item.topic}
                  </span>
                  <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </TableCell>
              <TableCell>
                <ul className="text-sm text-muted-foreground space-y-0.5">
                  {item.notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {item.resources.map((resource, i) => (
                    <Badge 
                      key={i} 
                      variant={getResourceVariant(resource.type)}
                      className="cursor-pointer hover:opacity-80 transition-opacity gap-1"
                    >
                      {getResourceIcon(resource.type)}
                      {resource.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}