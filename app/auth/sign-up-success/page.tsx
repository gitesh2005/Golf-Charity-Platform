import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Mail, ArrowRight } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="bg-gradient-radial pointer-events-none absolute inset-0" />
      
      <div className="relative w-full max-w-md text-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">PlayWin</span>
        </Link>

        <div className="glass-card mt-8 rounded-2xl p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
          <p className="mb-6 text-muted-foreground">
            We&apos;ve sent you a confirmation link. Click the link in your email to
            activate your account and start playing.
          </p>

          <Link href="/auth/login">
            <Button className="gap-2">
              Go to Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
