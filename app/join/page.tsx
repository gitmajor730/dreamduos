import { Wizard } from "@/components/join/Wizard";
import { supabaseConfig } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join Dream Duos",
  description: "Apply to provide in-home services with Dream Duos.",
};

export default function JoinPage() {
  const { url, key, ready } = supabaseConfig();
  if (!ready) {
    return (
      <main className="join">
        <h1>Signup is not configured yet.</h1>
        <p>Add the Supabase URL and publishable key to this environment, then reload.</p>
      </main>
    );
  }
  return <Wizard url={url} anonKey={key} />;
}
