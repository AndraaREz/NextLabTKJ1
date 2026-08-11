"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signup() {
    setLoading(true);
    setError("");

    const u = username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,24}$/.test(u)) {
      setError("Username 3–24 karakter: huruf, angka, titik, _ atau -.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowser();
    const { error: signUpError } = await supabase.auth.signUp({
      email: `${u}@auth.netlab.local`,
      password,
      options: {
        data: {
          user_name: u,
          full_name: displayName.trim() || u,
        },
      },
    });

    if (signUpError) {
      setError(
        signUpError.message.includes("already registered")
          ? "Username sudah digunakan."
          : signUpError.message,
      );
    } else {
      setDone(true);
    }
    setLoading(false);
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
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Daftar dengan username + password atau OAuth.</p>

        {done ? (
          <div className="mt-7 space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Akun berhasil dibuat. Jika Email Confirmation aktif di Supabase, matikan fitur tersebut untuk pola username internal ini karena alamat email teknis NETLAB tidak menerima email.
            </p>
            <Link href="/login"><Button className="w-full">Go to Login</Button></Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => oauth("google")}>Google</Button>
              <Button variant="secondary" onClick={() => oauth("github")}>GitHub</Button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /><span>atau</span><span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-4">
              <label className="block text-sm">Display name
                <input className="mt-2 h-11 w-full rounded-xl border bg-background px-3" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </label>
              <label className="block text-sm">Username
                <input className="mt-2 h-11 w-full rounded-xl border bg-background px-3" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
              </label>
              <label className="block text-sm">Password
                <input type="password" className="mt-2 h-11 w-full rounded-xl border bg-background px-3" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" loading={loading} onClick={signup}>Create account</Button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun? <Link className="underline text-foreground" href="/login">Login</Link>
        </p>
      </Card>
    </main>
  );
}
