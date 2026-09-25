import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { BriefcaseBusiness } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin, getAdminAuthStatus } from "@/lib/auth-actions.server";

export const Route = createFileRoute("/admin/login")({
  loader: async () => {
    const { authenticated } = await getAdminAuthStatus();
    if (authenticated) throw redirect({ to: "/admin" });
  },
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await loginAdmin({ data: { email, password } });
      if (!result.ok) {
        setError(result.error ?? "Unable to sign in.");
        setPending(false);
        return;
      }
      await router.invalidate();
      await router.navigate({ to: "/admin" });
    } catch (cause) {
      console.error(cause);
      setError("Unable to sign in right now. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BriefcaseBusiness className="size-5" />
          </span>
          <CardTitle className="mt-3 font-heading text-2xl font-extrabold">Admin Sign In</CardTitle>
          <CardDescription>Get Hired KE admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Sign in failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
