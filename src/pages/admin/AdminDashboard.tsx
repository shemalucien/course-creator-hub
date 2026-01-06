import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ClipboardList, Bell, TrendingUp, Plus } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  courses: number;
  students: number;
  quizzes: number;
  notifications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ courses: 0, students: 0, quizzes: 0, notifications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [coursesRes, enrollmentsRes, quizzesRes, notificationsRes] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('enrollments').select('id', { count: 'exact', head: true }),
        supabase.from('quizzes').select('id', { count: 'exact', head: true }),
        supabase.from('notifications').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        courses: coursesRes.count || 0,
        students: enrollmentsRes.count || 0,
        quizzes: quizzesRes.count || 0,
        notifications: notificationsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Courses', value: stats.courses, icon: BookOpen, color: 'text-blue-500', path: '/admin/courses' },
    { label: 'Enrolled Students', value: stats.students, icon: Users, color: 'text-green-500', path: '/admin/students' },
    { label: 'Active Quizzes', value: stats.quizzes, icon: ClipboardList, color: 'text-purple-500', path: '/admin/quizzes' },
    { label: 'Notifications Sent', value: stats.notifications, icon: Bell, color: 'text-orange-500', path: '/admin/notifications' },
  ];

  return (
    <AdminLayout title="Instructor Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.path}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">
                          {loading ? '...' : stat.value}
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/admin/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/quizzes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/notifications/new">
                <Bell className="h-4 w-4 mr-2" />
                Send Notification
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
