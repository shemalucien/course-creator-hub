import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AssessmentItem } from '@/data/academicCourses';

interface AssessmentTableProps {
  assessments: AssessmentItem[];
}

export function AssessmentTable({ assessments }: AssessmentTableProps) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead className="w-32 font-semibold">Activity</TableHead>
            <TableHead className="w-24 font-semibold">Grade</TableHead>
            <TableHead className="font-semibold">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((item, index) => (
            <TableRow key={index} className="hover:bg-secondary/20">
              <TableCell className="font-medium">{item.activity}</TableCell>
              <TableCell>
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {item.grade}
                </span>
              </TableCell>
              <TableCell>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
