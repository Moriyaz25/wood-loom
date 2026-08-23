import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
export const metadata = { title: "Create account | WOODLOOM" };
export default function RegisterPage() {
  return (
    <Suspense>
      <AuthCard
        mode="register"
        googleClientId={
          process.env.GOOGLE_CLIENT_ID ||
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        }
      />
    </Suspense>
  );
}
