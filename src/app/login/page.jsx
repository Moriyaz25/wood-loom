import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
export const metadata = { title: "Sign in | WOODLOOM" };
export default function LoginPage() {
  return (
    <Suspense>
      <AuthCard
        mode="login"
        googleClientId={
          process.env.GOOGLE_CLIENT_ID ||
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        }
      />
    </Suspense>
  );
}
