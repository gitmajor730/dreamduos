import { setProviderApproval, setServiceApproval } from "./actions";
import { services } from "@/lib/services";
import { adminEmails } from "@/lib/supabase";
import { serverClient } from "@/lib/supabase-server";

export const metadata = { title: "Provider applications · Dream Duos" };

export default async function AdminPage() {
  const supabase = await serverClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email?.toLowerCase() ?? "";
  if (!auth.user || !adminEmails().includes(email)) {
    return (
      <main className="join">
        <h1>Provider review</h1>
        <p>Sign in at the application page with an admin email, then return here.</p>
        <a className="button" href="/join">Go to sign in</a>
      </main>
    );
  }

  const { data: applications, error } = await supabase
    .from("provider_applications")
    .select("*, provider_services(*)")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false });

  return (
    <main className="join">
      <a className="wordmark" href="/">dreamduos</a>
      <h1>Applications</h1>
      <p className="lede">Approving the person and approving a service are separate. A missing Georgia massage license cannot be approved.</p>
      {error ? <p className="form-error">{error.message}</p> : null}
      {(applications ?? []).length === 0 ? <p>No submitted applications yet.</p> : null}
      {(applications ?? []).map((application) => (
        <article key={application.id} className="service-block">
          <h2>{application.first_name} {application.last_name}</h2>
          <p>{application.email} · {application.city} · Person: {application.provider_approval}</p>
          <form action={setProviderApproval.bind(null, application.id, application.provider_approval === "approved" ? "pending" : "approved")}>
            <button className="button button-small" type="submit">{application.provider_approval === "approved" ? "Mark person pending" : "Approve person"}</button>
          </form>
          <ul>
            {(application.provider_services ?? []).filter((service: { active: boolean }) => service.active).map((service: { id: string; service: string; approval: string; details: Record<string, unknown> }) => (
              <li key={service.id}>
                {services.find((item) => item.id === service.service)?.label ?? service.service}: {service.approval}
                <form action={setServiceApproval.bind(null, service.id, service.service, service.details ?? {}, service.approval === "approved" ? "pending" : "approved")}>
                  <button className="button button-small" type="submit">{service.approval === "approved" ? "Mark pending" : "Approve service"}</button>
                </form>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </main>
  );
}
