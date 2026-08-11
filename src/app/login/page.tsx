"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError("");

    const u = username.trim().toLowerCase();
    if (!u || !password) {
      setError("Username dan password wajib diisi.");
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: `${u}@auth.netlab.local`,
      password,
    });

    if (authError) {
      setError("Username atau password salah.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function oauth(provider: "google" | "github") {
    const supabase = createSupabaseBrowser();
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full p-7">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Masuk ke NETLAB.</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => oauth("google")}>Google</Button>
          <Button variant="secondary" onClick={() => oauth("github")}>GitHub</Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /><span>atau</span><span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-4">
          <label className="block text-sm">Username
            <input className="mt-2 h-11 w-full rounded-xl border bg-background px-3 outline-none focus:ring-2 focus:ring-accent" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </label>
          <label className="block text-sm">Password
            <input type="password" className="mt-2 h-11 w-full rounded-xl border bg-background px-3 outline-none focus:ring-2 focus:ring-accent" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" loading={loading} onClick={login}>Login</Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun? <Link className="text-foreground underline" href="/signup">Sign up</Link>
        </p>
      </Card>
    </main>
  );
}
