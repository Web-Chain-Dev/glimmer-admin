import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/tmpadmin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: "elena.usnich@gmail.com",
          password: "A8402046",
          email_confirm: true,
        });
        return new Response(JSON.stringify({ id: data?.user?.id ?? null, error: error?.message ?? null }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
