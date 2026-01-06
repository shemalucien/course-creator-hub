import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Enrollment {
  id: string;
  enrolled_at: string;
  user_id: string;
  profiles?: { full_name?: string; email?: string };
  courses?: { code: string; title: string };
}

export default function StudentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          user_id,
          courses(code, title)
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately since we can't join on user_id directly
      const userIds = [...new Set((data || []).map(e => e.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));

      setEnrollments((data || []).map(e => ({
        ...e,
        profiles: profileMap.get(e.user_id)
      })));
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({ variant: 'destructive', title: 'Failed to load students' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  };

  if (loading) {
    return (
      <AdminLayout title="Students">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  // Group enrollments by student
  const studentMap = new Map<string, { profile: any; courses: any[] }>();
  enrollments.forEach(e => {
    const existing = studentMap.get(e.user_id);
    if (existing) {
      existing.courses.push(e.courses);
    } else {
      studentMap.set(e.user_id, {
        profile: e.profiles,
        courses: [e.courses]
      });
    }
  });

  const students = Array.from(studentMap.entries());

  return (
    <AdminLayout title="Students">
      <div className="space-y-6">
        <p className="text-muted-foreground">
          {students.length} students enrolled across all courses
        </p>

        {students.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No students enrolled yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {students.map(([userId, { profile, courses }]) => (
              <Card key={userId} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(profile?.full_name, profile?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {profile?.full_name || profile?.email || 'Unknown User'}
                      </p>
                      {profile?.email && profile?.full_name && (
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {courses.map((course: any, i: number) => (
                        <Badge key={i} variant="outline">
                          {course?.code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
