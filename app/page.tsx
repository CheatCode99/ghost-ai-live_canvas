import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <AuthRedirect />
    </Suspense>
  );
}

async function AuthRedirect() {
  const { userId } = await auth();

  return redirect(userId ? "/editor" : "/sign-in");
}
