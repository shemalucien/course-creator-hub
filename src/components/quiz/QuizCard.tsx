import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description?: string;
    time_limit_minutes?: number;
    passing_score?: number;
  };
  attempt?: {
    percentage?: number;
    completed_at?: string;
  };
  onStart: () => void;
}

export function QuizCard({ quiz, attempt, onStart }: QuizCardProps) {
  const hasPassed = attempt && (attempt.percentage || 0) >= (quiz.passing_score || 60);
  const hasAttempted = !!attempt?.completed_at;

  return (
    <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="mt-1">{quiz.description}</CardDescription>
            )}
          </div>
          {hasAttempted && (
            <Badge variant={hasPassed ? 'default' : 'destructive'} className="ml-2">
              {hasPassed ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Passed
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Failed
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {quiz.time_limit_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {quiz.time_limit_minutes} min
              </span>
            )}
            <span>Pass: {quiz.passing_score || 60}%</span>
            {hasAttempted && (
              <span className="text-foreground font-medium">
                Score: {attempt?.percentage?.toFixed(0)}%
              </span>
            )}
          </div>
          <Button onClick={onStart} variant={hasAttempted ? 'outline' : 'default'} size="sm">
            {hasAttempted ? 'Retake' : 'Start Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
