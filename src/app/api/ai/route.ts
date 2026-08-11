import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  provider: z.enum(["gemini", "openai", "anthropic", "xai", "deepseek", "qwen", "github", "ollama"]),
  model: z.string().min(1).max(160),
  message: z.string().min(1).max(12000),
});

const systemPrompt =
  "You are NETLAB AI, a networking tutor for TKJ students. Answer in clear Indonesian. Explain concepts step-by-step, use practical networking examples, and keep advice safe and educational.";

const keyFor = (provider: string) =>
  ({
    gemini: process.env.GEMINI_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    xai: process.env.XAI_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    qwen: process.env.QWEN_API_KEY,
    github: process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN,
  })[provider];

async function jsonFrom(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || `HTTP ${response.status}` };
  }
}

async function openAICompatible(
  base: string,
  key: string | undefined,
  model: string,
  message: string,
  extraHeaders: Record<string, string> = {},
) {
  if (!key) throw new Error("API key provider ini belum dikonfigurasi di Vercel.");

  const response = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 1600,
    }),
    cache: "no-store",
  });

  const data = await jsonFrom(response);
  if (!response.ok) throw new Error(data?.error?.message || data?.message || "Provider error.");
  return data?.choices?.[0]?.message?.content || "Provider tidak mengembalikan teks.";
}

export async function GET() {
  return NextResponse.json({
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      xai: Boolean(process.env.XAI_API_KEY),
      deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
      qwen: Boolean(process.env.QWEN_API_KEY),
      github: Boolean(process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN),
      ollama: Boolean(process.env.OLLAMA_BASE_URL),
    },
  });
}

export async function POST(request: Request) {
  try {
    const { provider, model, message } = schema.parse(await request.json());

    if (provider === "gemini") {
      const key = keyFor(provider);
      if (!key) throw new Error("GEMINI_API_KEY belum dikonfigurasi.");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 1600 },
          }),
          cache: "no-store",
        },
      );
      const data = await jsonFrom(response);
      if (!response.ok) throw new Error(data?.error?.message || "Gemini error.");
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("");
      return NextResponse.json({ text: text || "Gemini tidak mengembalikan teks." });
    }

    if (provider === "anthropic") {
      const key = keyFor(provider);
      if (!key) throw new Error("ANTHROPIC_API_KEY belum dikonfigurasi.");
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1600,
          system: systemPrompt,
          messages: [{ role: "user", content: message }],
        }),
        cache: "no-store",
      });
      const data = await jsonFrom(response);
      if (!response.ok) throw new Error(data?.error?.message || "Anthropic error.");
      return NextResponse.json({ text: data?.content?.map((item: { text?: string }) => item.text || "").join("") || "Claude tidak mengembalikan teks." });
    }

    if (provider === "github") {
      const key = keyFor(provider);
      if (!key) throw new Error("GITHUB_MODELS_TOKEN belum dikonfigurasi. Gunakan token GitHub dengan akses Models.");
      const response = await fetch("https://models.github.ai/inference/chat/completions", {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "X-GitHub-Api-Version": "2026-03-10",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.4,
          max_tokens: 1600,
        }),
        cache: "no-store",
      });
      const data = await jsonFrom(response);
      if (!response.ok) throw new Error(data?.error?.message || data?.message || "GitHub Models error.");
      return NextResponse.json({ text: data?.choices?.[0]?.message?.content || "GitHub Models tidak mengembalikan teks." });
    }

    if (provider === "ollama") {
      const base = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/api";
      const response = await fetch(`${base.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.OLLAMA_API_KEY ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : {}),
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          stream: false,
        }),
        cache: "no-store",
      });
      const data = await jsonFrom(response);
      if (!response.ok) throw new Error(data?.error || "Ollama error.");
      return NextResponse.json({ text: data?.message?.content || "Ollama tidak mengembalikan teks." });
    }

    const bases: Record<string, string> = {
      openai: "https://api.openai.com/v1",
      xai: "https://api.x.ai/v1",
      deepseek: "https://api.deepseek.com/v1",
      qwen: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    };

    return NextResponse.json({
      text: await openAICompatible(bases[provider], keyFor(provider), model, message),
    });
  } catch (error) {
    const message = error instanceof z.ZodError
      ? "Request AI tidak valid."
      : error instanceof Error
        ? error.message
        : "AI request gagal.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
