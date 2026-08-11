"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Calculator, Network, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

const items = [
  ["Toolbox", "/tools", Calculator],
  ["Network Lab", "/lab", Network],
  ["Learning", "/learn", BookOpen],
  ["AI Assistant", "/ai", Sparkles],
] as const;

const lessonSlugs = [
  "osi", "tcp-ip", "ip-addressing", "subnetting", "vlan",
  "dhcp", "dns", "routing", "nat", "firewall",
];

export default function Dashboard() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (alive) setReady(true);
        return;
      }

      const { data } = await supabase
        .from("learning_progress")
        .select("lesson_slug, completed")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (alive) {
        setCompleted((data ?? []).map((row) => row.lesson_slug));
        setReady(true);
      }
    })();

    return () => { alive = false; };
  }, []);

  const progress = useMemo(
    () => Math.round((completed.filter((slug) => lessonSlugs.includes(slug)).length / lessonSlugs.length) * 100),
    [completed]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">NETLAB</p>
      <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Pusat aktivitas belajar dan praktik jaringan.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([title, href, Icon]) => (
          <Link href={href} key={href}>
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-foreground/20">
              <Icon className="h-5 w-5" />
              <h2 className="mt-5 font-medium">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Buka workspace {title.toLowerCase()}.</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-medium">Progress belajar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {ready ? `${completed.length} dari ${lessonSlugs.length} materi selesai.` : "Memuat progress..."}
              </p>
            </div>
            <span className="text-2xl font-semibold">{ready ? `${progress}%` : "—"}</span>
          </div>
          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={ready ? progress : 0}
          >
            <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${ready ? progress : 0}%` }} />
          </div>
          {!ready && <p className="mt-3 text-sm text-muted-foreground">Hubungkan Supabase untuk menyimpan progress.</p>}
          {ready && completed.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">Mulai dari Learning Center untuk mengisi progress kamu.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-medium">Class</h2>
          <p className="mt-3 text-2xl font-semibold">TKJ 1</p>
          <p className="mt-1 text-sm text-muted-foreground">Ruang belajar jaringan komputer.</p>
        </Card>
      </div>
    </main>
  );
}
