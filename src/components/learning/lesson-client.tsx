"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function LessonClient({ slug, title, body }: { slug: string; title: string; body: string[] }) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (alive) setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("learning_progress")
        .select("completed")
        .eq("user_id", user.id)
        .eq("lesson_slug", slug)
        .maybeSingle();

      if (alive) {
        setCompleted(Boolean(data?.completed));
        setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [slug]);

  async function toggleComplete() {
    setMessage("");
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Login dulu agar progress bisa disimpan.");
      return;
    }

    const next = !completed;
    const { error } = await supabase.from("learning_progress").upsert({
      user_id: user.id,
      lesson_slug: slug,
      completed: next,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage("Progress belum tersimpan. Pastikan schema Supabase sudah dijalankan.");
      return;
    }

    setCompleted(next);
    setMessage(next ? "Materi ditandai selesai." : "Status selesai dibatalkan.");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/learn" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kembali ke Learning
      </Link>

      <p className="mt-8 text-sm text-accent">LEARNING CENTER</p>
      <h1 className="mt-3 text-4xl font-semibold">{title}</h1>

      <div className="mt-8 space-y-5">
        {body.map((paragraph, index) => (
          <p key={index} className="leading-8 text-muted-foreground">{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5">
        <Button onClick={toggleComplete} variant={completed ? "secondary" : "primary"} disabled={loading}>
          {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          {completed ? "Sudah selesai" : "Tandai selesai"}
        </Button>
        {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
      </div>
    </main>
  );
}
