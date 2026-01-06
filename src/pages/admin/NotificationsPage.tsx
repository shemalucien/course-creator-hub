import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Send, Plus, ArrowLeft } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  code: string;
  title: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  created_at: string;
  courses?: { code: string };
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    course_id: '',
    title: '',
    message: '',
    notification_type: 'announcement'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, notificationsRes] = await Promise.all([
        supabase.from('courses').select('id, code, title').order('code'),
        supabase.from('notifications').select('*, courses(code)').order('created_at', { ascending: false }).limit(20)
      ]);

      setCourses(coursesRes.data || []);
      setNotifications(notificationsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!form.course_id || !form.title || !form.message) {
      toast({ variant: 'destructive', title: 'All fields are required' });
      return;
    }

    setSending(true);

    try {
      // Create notification
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          course_id: form.course_id,
          title: form.title.trim(),
          message: form.message.trim(),
          notification_type: form.notification_type,
          created_by: user?.id
        })
        .select('*, courses(code)')
        .single();

      if (error) throw error;

      // Get enrolled students
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('user_id')
        .eq('course_id', form.course_id);

      if (enrollments && enrollments.length > 0) {
        // Create notification recipients
        const recipients = enrollments.map(e => ({
          notification_id: notification.id,
          user_id: e.user_id
        }));

        await supabase.from('notification_recipients').insert(recipients);

        // Try to send emails via edge function (if configured)
        try {
          await supabase.functions.invoke('send-notification-email', {
            body: {
              notificationId: notification.id,
              courseId: form.course_id
            }
          });
        } catch (emailError) {
          console.log('Email sending not configured or failed:', emailError);
        }
      }

      setNotifications([notification, ...notifications]);
      setForm({ course_id: '', title: '', message: '', notification_type: 'announcement' });
      setShowForm(false);
      
      toast({ 
        title: 'Notification sent!',
        description: `Sent to ${enrollments?.length || 0} students`
      });
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast({ variant: 'destructive', title: 'Failed to send notification', description: error.message });
    } finally {
      setSending(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-500/10 text-blue-500';
      case 'assignment': return 'bg-orange-500/10 text-orange-500';
      case 'quiz': return 'bg-purple-500/10 text-purple-500';
      case 'resource': return 'bg-green-500/10 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Notifications">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Notifications">
      <div className="space-y-6">
        {showForm ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Send Notification</CardTitle>
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
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
                <Label>Type</Label>
                <Select
                  value={form.notification_type}
                  onValueChange={(value) => setForm({ ...form, notification_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="resource">New Resource</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message to students..."
                  rows={4}
                />
              </div>

              <Button onClick={handleSend} disabled={sending} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Send announcements and updates to enrolled students
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Notification
              </Button>
            </div>

            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No notifications sent yet</p>
                  <Button onClick={() => setShowForm(true)}>Send your first notification</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{notification.title}</h3>
                            <Badge className={getTypeColor(notification.notification_type)}>
                              {notification.notification_type}
                            </Badge>
                            {notification.courses && (
                              <Badge variant="outline">{notification.courses.code}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
