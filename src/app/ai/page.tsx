"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { providers, type Provider } from "@/lib/ai";

type Status = Record<Provider, boolean>;

export default function AIPage() {
  const [provider, setProvider] = useState<Provider>("gemini");
  const [model, setModel] = useState(providers.gemini.models[0]);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/ai")
      .then((r) => r.json())
      .then((data) => setStatus(data.providers ?? null))
      .catch(() => setStatus(null));
  }, []);

  const current = useMemo(() => providers[provider], [provider]);

  async function ask() {
    if (!message.trim() || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, model, message: message.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request gagal.");
      setAnswer(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><Sparkles className="h-5 w-5" /></span>
        <div>
          <h1 className="text-3xl font-semibold">NETLAB AI</h1>
          <p className="mt-1 text-muted-foreground">Pilih provider dan model untuk belajar networking.</p>
        </div>
      </div>

      <Card className="mt-8 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Provider
            <select
              value={provider}
              onChange={(e) => {
                const next = e.target.value as Provider;
                setProvider(next);
                setModel(providers[next].models[0]);
                setError("");
              }}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3"
            >
              {Object.entries(providers).map(([id, p]) => (
                <option key={id} value={id}>{p.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Model
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3"
            >
              {current.models.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          {status?.[provider] ? <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Provider siap</> : provider === "ollama" ? <><CircleAlert className="h-4 w-4" /> Ollama memakai server lokal/URL yang kamu konfigurasi.</> : <><CircleAlert className="h-4 w-4" /> API key belum terdeteksi di environment.</>}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") ask(); }}
          placeholder="Contoh: jelaskan subnetting /27 dengan contoh..."
          className="mt-4 min-h-36 w-full rounded-xl border border-border bg-background p-4 outline-none focus:ring-2 focus:ring-accent"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button loading={loading} disabled={!message.trim()} onClick={ask}>
            {loading ? "Thinking..." : `Ask ${current.label}`}
          </Button>
          <span className="text-xs text-muted-foreground">Ctrl/⌘ + Enter untuk kirim</span>
        </div>

        {error && <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">{error}</div>}

        {loading && !answer && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border bg-muted p-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> AI sedang memproses...
          </div>
        )}

        {answer && (
          <div className="mt-6 whitespace-pre-wrap rounded-2xl border bg-muted p-5 text-sm leading-7">{answer}</div>
        )}
      </Card>
    </main>
  );
}
