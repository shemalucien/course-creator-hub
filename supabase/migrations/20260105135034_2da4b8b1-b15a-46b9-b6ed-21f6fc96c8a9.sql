-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  semester TEXT,
  prerequisites TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  instructor_name TEXT,
  instructor_email TEXT,
  schedule_days TEXT,
  schedule_time TEXT,
  office_hours TEXT[],
  textbooks TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses policies (public read, instructors can manage their own)
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Instructors can insert courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Instructors can update their courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (instructor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can delete their courses"
  ON public.courses FOR DELETE
  TO authenticated
  USING (instructor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Create learning outcomes table
CREATE TABLE public.learning_outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  outcome_id TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning outcomes"
  ON public.learning_outcomes FOR SELECT
  USING (true);

CREATE POLICY "Instructors can manage learning outcomes"
  ON public.learning_outcomes FOR ALL
  TO authenticated
  USING (true);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  grade_percentage TEXT NOT NULL,
  details TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view assessments"
  ON public.assessments FOR SELECT
  USING (true);

CREATE POLICY "Instructors can manage assessments"
  ON public.assessments FOR ALL
  TO authenticated
  USING (true);

-- Create schedule items table (chapters/topics)
CREATE TABLE public.schedule_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter TEXT NOT NULL,
  topic TEXT NOT NULL,
  slide_url TEXT,
  notes TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedule items"
  ON public.schedule_items FOR SELECT
  USING (true);

CREATE POLICY "Instructors can manage schedule items"
  ON public.schedule_items FOR ALL
  TO authenticated
  USING (true);

-- Create resources table (assignments, activities, templates)
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_item_id UUID REFERENCES public.schedule_items(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('assignment', 'activity', 'template', 'link', 'slide')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON public.resources FOR SELECT
  USING (true);

CREATE POLICY "Instructors can manage resources"
  ON public.resources FOR ALL
  TO authenticated
  USING (true);

-- Create news table
CREATE TABLE public.course_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news"
  ON public.course_news FOR SELECT
  USING (true);

CREATE POLICY "Instructors can manage news"
  ON public.course_news FOR ALL
  TO authenticated
  USING (true);

-- Create enrollments table for student tracking
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress JSONB DEFAULT '{}',
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view course enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (course_id IN (
    SELECT c.id FROM courses c 
    JOIN profiles p ON c.instructor_id = p.id 
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "Users can enroll themselves"
  ON public.enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  schedule_item_id UUID NOT NULL REFERENCES public.schedule_items(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, schedule_item_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for course files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-files', 'course-files', true);

-- Storage policies for course files
CREATE POLICY "Anyone can view course files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-files');

CREATE POLICY "Authenticated users can upload course files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'course-files');

CREATE POLICY "Users can update their own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'course-files');

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'course-files');

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();