import { PlayCircle, FileText, HelpCircle, ClipboardList, CheckCircle2, Circle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Chapter, Lesson } from '@/data/courses';

interface ChapterAccordionProps {
  chapters: Chapter[];
}

function getLessonIcon(type: Lesson['type']) {
  switch (type) {
    case 'video':
      return PlayCircle;
    case 'reading':
      return FileText;
    case 'quiz':
      return HelpCircle;
    case 'assignment':
      return ClipboardList;
    default:
      return PlayCircle;
  }
}

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  return (
    <Accordion type="multiple" className="space-y-3">
      {chapters.map((chapter, chapterIndex) => (
        <AccordionItem
          key={chapter.id}
          value={chapter.id}
          className="border border-border/50 rounded-xl bg-card/50 overflow-hidden"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                {chapterIndex + 1}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{chapter.title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {chapter.lessons.length} lessons • {chapter.description}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="px-5 pb-4 pt-2">
            <div className="space-y-1 pl-14">
              {chapter.lessons.map((lesson) => {
                const Icon = getLessonIcon(lesson.type);
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-course-complete" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium">{lesson.title}</span>
                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
