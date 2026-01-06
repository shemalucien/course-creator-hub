import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  notificationId: string;
  courseId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notificationId, courseId }: NotificationEmailRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured, skipping email sending");
      return new Response(
        JSON.stringify({ message: "Email sending not configured" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get notification details
    const { data: notification, error: notifError } = await supabase
      .from("notifications")
      .select("*, courses(code, title)")
      .eq("id", notificationId)
      .single();

    if (notifError || !notification) {
      throw new Error("Notification not found");
    }

    // Get enrolled students with their emails
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("user_id, profiles(email, full_name)")
      .eq("course_id", courseId);

    if (enrollError) {
      throw new Error("Failed to fetch enrollments");
    }

    const resend = new Resend(resendApiKey);

    const sentEmails: string[] = [];
    const failedEmails: string[] = [];

    // Send emails to each enrolled student
    for (const enrollment of enrollments || []) {
      const profile = enrollment.profiles as any;
      const email = profile?.email;

      if (!email) continue;

      try {
        await resend.emails.send({
          from: "Course Portal <onboarding@resend.dev>",
          to: [email],
          subject: `[${notification.courses.code}] ${notification.title}`,
          html: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Course Notification</h1>
              </div>
              
              <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">
                  ${notification.courses.code} - ${notification.courses.title}
                </p>
                
                <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px;">
                  ${notification.title}
                </h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <p style="color: #475569; margin: 0; line-height: 1.6;">
                    ${notification.message.replace(/\n/g, '<br>')}
                  </p>
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                  This notification was sent from Course Portal
                </p>
              </div>
            </div>
          `,
        });

        sentEmails.push(email);

        // Update notification_recipients to mark as sent
        await supabase
          .from("notification_recipients")
          .update({ email_sent: true })
          .eq("notification_id", notificationId)
          .eq("user_id", enrollment.user_id);

      } catch (emailError) {
        console.error(`Failed to send to ${email}:`, emailError);
        failedEmails.push(email);
      }
    }

    console.log(`Emails sent: ${sentEmails.length}, Failed: ${failedEmails.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentEmails.length,
        failed: failedEmails.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
