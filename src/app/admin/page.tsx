import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}