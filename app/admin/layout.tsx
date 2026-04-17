import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    // If logged in but not admin, kick them back to home
    redirect("/");
  }

  return (
    <div style={{ minHeight: "calc(100vh - var(--navbar-height))" }}>
      {children}
    </div>
  );
}
