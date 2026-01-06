import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, Upload, Video, FileText, ArrowLeft } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from '@/components/upload/FileUpload';

interface ScheduleItem {
  id?: string;
  chapter: string;
  topic: string;
  slide_url?: string;
  video_url?: string;
  video_type?: 'youtube' | 'uploaded';
  notes?: string[];
  sort_order: number;
}

interface CourseForm {
  code: string;
  title: string;
  description: string;
  semester: string;
  prerequisites: string;
  instructor_name: string;
  instructor_email: string;
  schedule_days: string;
  schedule_time: string;
  office_hours: string[];
  textbooks: string[];
  is_published: boolean;
}

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isNew = courseId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CourseForm>({
    code: '',
    title: '',
    description: '',
    semester: '',
    prerequisites: '',
    instructor_name: '',
    instructor_email: '',
    schedule_days: '',
    schedule_time: '',
    office_hours: [''],
    textbooks: [''],
    is_published: false
  });
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [dbCourseId, setDbCourseId] = useState<string | null>(courseId === 'new' ? null : courseId || null);

  useEffect(() => {
    if (!isNew && courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;

      setForm({
        code: course.code,
        title: course.title,
        description: course.description || '',
        semester: course.semester || '',
        prerequisites: course.prerequisites || '',
        instructor_name: course.instructor_name || '',
        instructor_email: course.instructor_email || '',
        schedule_days: course.schedule_days || '',
        schedule_time: course.schedule_time || '',
        office_hours: course.office_hours || [''],
        textbooks: course.textbooks || [''],
        is_published: course.is_published || false
      });

      // Fetch schedule items
      const { data: items } = await supabase
        .from('schedule_items')
        .select('*')
        .eq('course_id', courseId)
        .order('sort_order');

      setScheduleItems((items || []).map(item => ({
        ...item,
        video_type: item.video_type as 'youtube' | 'uploaded' | undefined
      })));
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({ variant: 'destructive', title: 'Failed to load course' });
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.code || !form.title) {
      toast({ variant: 'destructive', title: 'Code and title are required' });
      return;
    }

    setSaving(true);

    try {
      // Get instructor profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      const courseData = {
        code: form.code.trim(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        semester: form.semester.trim() || null,
        prerequisites: form.prerequisites.trim() || null,
        instructor_name: form.instructor_name.trim() || null,
        instructor_email: form.instructor_email.trim() || null,
        schedule_days: form.schedule_days.trim() || null,
        schedule_time: form.schedule_time.trim() || null,
        office_hours: form.office_hours.filter(h => h.trim()),
        textbooks: form.textbooks.filter(t => t.trim()),
        is_published: form.is_published,
        instructor_id: profile?.id || null
      };

      let savedCourseId = dbCourseId;

      if (isNew) {
        const { data, error } = await supabase
          .from('courses')
          .insert(courseData)
          .select('id')
          .single();

        if (error) throw error;
        savedCourseId = data.id;
        setDbCourseId(savedCourseId);
      } else {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId);

        if (error) throw error;
      }

      // Save schedule items
      if (savedCourseId && scheduleItems.length > 0) {
        // Delete existing items
        await supabase.from('schedule_items').delete().eq('course_id', savedCourseId);

        // Insert new items
        const itemsToInsert = scheduleItems.map((item, index) => ({
          course_id: savedCourseId,
          chapter: item.chapter,
          topic: item.topic,
          slide_url: item.slide_url || null,
          video_url: item.video_url || null,
          video_type: item.video_type || null,
          notes: item.notes || null,
          sort_order: index
        }));

        const { error } = await supabase.from('schedule_items').insert(itemsToInsert);
        if (error) throw error;
      }

      toast({ title: isNew ? 'Course created!' : 'Course saved!' });
      
      if (isNew) {
        navigate(`/admin/courses/${savedCourseId}`);
      }
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast({ variant: 'destructive', title: 'Failed to save course', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const addScheduleItem = () => {
    setScheduleItems([...scheduleItems, {
      chapter: `Week ${scheduleItems.length + 1}`,
      topic: '',
      sort_order: scheduleItems.length
    }]);
  };

  const updateScheduleItem = (index: number, updates: Partial<ScheduleItem>) => {
    setScheduleItems(items => items.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));
  };

  const removeScheduleItem = (index: number) => {
    setScheduleItems(items => items.filter((_, i) => i !== index));
  };

  const handleSlideUpload = (index: number, url: string) => {
    updateScheduleItem(index, { slide_url: url });
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
    <AdminLayout title={isNew ? 'Create Course' : `Edit: ${form.code}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin/courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
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
              {saving ? 'Saving...' : 'Save Course'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule & Content</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code *</Label>
                    <Input
                      id="code"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="e.g., CS 101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                      placeholder="e.g., Fall 2024"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Course description..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Input
                    id="prerequisites"
                    value={form.prerequisites}
                    onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
                    placeholder="e.g., Math 101, CS 100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor_name">Instructor Name</Label>
                    <Input
                      id="instructor_name"
                      value={form.instructor_name}
                      onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor_email">Instructor Email</Label>
                    <Input
                      id="instructor_email"
                      type="email"
                      value={form.instructor_email}
                      onChange={(e) => setForm({ ...form, instructor_email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule_days">Class Days</Label>
                    <Input
                      id="schedule_days"
                      value={form.schedule_days}
                      onChange={(e) => setForm({ ...form, schedule_days: e.target.value })}
                      placeholder="e.g., Mon/Wed/Fri"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule_time">Class Time</Label>
                    <Input
                      id="schedule_time"
                      value={form.schedule_time}
                      onChange={(e) => setForm({ ...form, schedule_time: e.target.value })}
                      placeholder="e.g., 10:00 AM - 11:30 AM"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Office Hours</Label>
                  {form.office_hours.map((hour, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={hour}
                        onChange={(e) => {
                          const newHours = [...form.office_hours];
                          newHours[index] = e.target.value;
                          setForm({ ...form, office_hours: newHours });
                        }}
                        placeholder="e.g., Monday 2:00 PM - 4:00 PM"
                      />
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newHours = form.office_hours.filter((_, i) => i !== index);
                            setForm({ ...form, office_hours: newHours });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({ ...form, office_hours: [...form.office_hours, ''] })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Office Hour
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Textbooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {form.textbooks.map((book, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={book}
                      onChange={(e) => {
                        const newBooks = [...form.textbooks];
                        newBooks[index] = e.target.value;
                        setForm({ ...form, textbooks: newBooks });
                      }}
                      placeholder="Textbook title and author"
                    />
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newBooks = form.textbooks.filter((_, i) => i !== index);
                          setForm({ ...form, textbooks: newBooks });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForm({ ...form, textbooks: [...form.textbooks, ''] })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Textbook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Add chapters/weeks with slides, videos, and notes
              </p>
              <Button onClick={addScheduleItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </div>

            {scheduleItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No schedule items yet</p>
                  <Button onClick={addScheduleItem}>Add your first chapter</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {scheduleItems.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Chapter {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeScheduleItem(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Chapter/Week</Label>
                          <Input
                            value={item.chapter}
                            onChange={(e) => updateScheduleItem(index, { chapter: e.target.value })}
                            placeholder="e.g., Week 1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Topic</Label>
                          <Input
                            value={item.topic}
                            onChange={(e) => updateScheduleItem(index, { topic: e.target.value })}
                            placeholder="e.g., Introduction to Algorithms"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Slides
                          </Label>
                          {item.slide_url ? (
                            <div className="flex items-center gap-2">
                              <Input value={item.slide_url} readOnly className="text-sm" />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateScheduleItem(index, { slide_url: undefined })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <FileUpload
                              folder={`slides/${dbCourseId || 'new'}`}
                              accept=".pdf,.pptx,.ppt"
                              onUploadComplete={(url) => handleSlideUpload(index, url)}
                            />
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video
                          </Label>
                          <div className="space-y-2">
                            <Select
                              value={item.video_type || ''}
                              onValueChange={(value) => updateScheduleItem(index, { 
                                video_type: value as 'youtube' | 'uploaded' 
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Video type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="youtube">YouTube URL</SelectItem>
                                <SelectItem value="uploaded">Upload Video</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {item.video_type === 'youtube' && (
                              <Input
                                value={item.video_url || ''}
                                onChange={(e) => updateScheduleItem(index, { video_url: e.target.value })}
                                placeholder="https://youtube.com/watch?v=..."
                              />
                            )}
                            
                            {item.video_type === 'uploaded' && (
                              item.video_url ? (
                                <div className="flex items-center gap-2">
                                  <Input value={item.video_url} readOnly className="text-sm" />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateScheduleItem(index, { video_url: undefined })}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <FileUpload
                                  folder={`videos/${dbCourseId || 'new'}`}
                                  accept="video/*"
                                  onUploadComplete={(url) => updateScheduleItem(index, { video_url: url })}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
