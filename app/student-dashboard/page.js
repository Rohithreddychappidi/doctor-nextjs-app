import { redirect } from "next/navigation";

export default function LegacyStudentDashboardRedirect() {
  redirect("/student/dashboard");
}
