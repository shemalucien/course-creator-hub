import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id?: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  points: number;
  sort_order: number;
}

interface Course {
  id: string;
  code: string;
  title: string;
}

export default function QuizEditor() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = quizId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    course_id: '',
    title: '',
    description: '',
    time_limit_minutes: '',
    passing_score: '60',
    is_published: false
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchCourses();
    if (!isNew && quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id, code, title').order('code');
    setCourses(data || []);
  };

  const fetchQuiz = async () => {
    try {
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (error) throw error;

      setForm({
        course_id: quiz.course_id,
        title: quiz.title,
        description: quiz.description || '',
        time_limit_minutes: quiz.time_limit_minutes?.toString() || '',
        passing_score: quiz.passing_score?.toString() || '60',
        is_published: quiz.is_published || false
      });

      const { data: questionsData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('sort_order');

      setQuestions((questionsData || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string || '[]'),
        question_type: q.question_type as 'multiple_choice' | 'true_false'
      })));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast({ variant: 'destructive', title: 'Failed to load quiz' });
      navigate('/admin/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.course_id || !form.title) {
      toast({ variant: 'destructive', title: 'Course and title are required' });
      return;
    }

    setSaving(true);

    try {
      const quizData = {
        course_id: form.course_id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        time_limit_minutes: form.time_limit_minutes ? parseInt(form.time_limit_minutes) : null,
        passing_score: parseInt(form.passing_score) || 60,
        is_published: form.is_published
      };

      let savedQuizId = quizId;

      if (isNew) {
        const { data, error } = await supabase
          .from('quizzes')
          .insert(quizData)
          .select('id')
          .single();

        if (error) throw error;
        savedQuizId = data.id;
      } else {
        const { error } = await supabase
          .from('quizzes')
          .update(quizData)
          .eq('id', quizId);

        if (error) throw error;
      }

      // Save questions
      if (savedQuizId && questions.length > 0) {
        await supabase.from('quiz_questions').delete().eq('quiz_id', savedQuizId);

        const questionsToInsert = questions.map((q, index) => ({
          quiz_id: savedQuizId,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer,
          points: q.points,
          sort_order: index
        }));

        const { error } = await supabase.from('quiz_questions').insert(questionsToInsert);
        if (error) throw error;
      }

      toast({ title: isNew ? 'Quiz created!' : 'Quiz saved!' });
      
      if (isNew) {
        navigate(`/admin/quizzes/${savedQuizId}`);
      }
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      toast({ variant: 'destructive', title: 'Failed to save quiz', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      sort_order: questions.length
    }]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions(qs => qs.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const removeQuestion = (index: number) => {
    setQuestions(qs => qs.filter((_, i) => i !== index));
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qIndex) return q;
      const newOptions = [...q.options];
      newOptions[oIndex] = value;
      return { ...q, options: newOptions };
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? 'Create Quiz' : `Edit: ${form.title}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin/quizzes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
              />
              <Label>Published</Label>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Quiz'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Course *</Label>
              <Select
                value={form.course_id}
                onValueChange={(value) => setForm({ ...form, course_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Chapter 1 Quiz"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Quiz description..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                <Input
                  id="time_limit"
                  type="number"
                  value={form.time_limit_minutes}
                  onChange={(e) => setForm({ ...form, time_limit_minutes: e.target.value })}
                  placeholder="No limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passing_score">Passing Score (%)</Label>
                <Input
                  id="passing_score"
                  type="number"
                  value={form.passing_score}
                  onChange={(e) => setForm({ ...form, passing_score: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Questions ({questions.length})</h2>
            <Button onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No questions yet</p>
                <Button onClick={addQuestion}>Add your first question</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((question, qIndex) => (
                <Card key={qIndex}>
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        Question {qIndex + 1}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Textarea
                        value={question.question_text}
                        onChange={(e) => updateQuestion(qIndex, { question_text: e.target.value })}
                        placeholder="Enter your question..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={question.question_type}
                          onValueChange={(value) => {
                            const type = value as 'multiple_choice' | 'true_false';
                            updateQuestion(qIndex, { 
                              question_type: type,
                              options: type === 'true_false' ? ['True', 'False'] : ['', '', '', ''],
                              correct_answer: ''
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="true_false">True/False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(qIndex, { points: parseInt(e.target.value) || 1 })}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correct_answer === option && option !== ''}
                              onChange={() => updateQuestion(qIndex, { correct_answer: option })}
                              className="h-4 w-4"
                            />
                            {question.question_type === 'true_false' ? (
                              <span className="flex-1">{option}</span>
                            ) : (
                              <Input
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select the radio button next to the correct answer
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
