export type Provider =
  | "gemini"
  | "openai"
  | "anthropic"
  | "xai"
  | "deepseek"
  | "qwen"
  | "github"
  | "ollama";

export const providers: Record<Provider, { label: string; models: string[] }> = {
  gemini: {
    label: "Gemini",
    models: ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-pro"],
  },
  openai: {
    label: "GPT",
    models: ["gpt-4o-mini", "gpt-4o"],
  },
  anthropic: {
    label: "Claude",
    models: ["claude-3-5-haiku-latest", "claude-3-5-sonnet-latest"],
  },
  xai: {
    label: "Grok",
    models: ["grok-3-mini", "grok-3"],
  },
  deepseek: {
    label: "DeepSeek",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  qwen: {
    label: "Qwen",
    models: ["qwen-plus", "qwen-turbo"],
  },
  github: {
    label: "GitHub Models / Copilot",
    models: ["openai/gpt-4.1", "deepseek/DeepSeek-R1", "meta/Llama-4-Scout-17B-16E-Instruct"],
  },
  ollama: {
    label: "Ollama",
    models: ["llama3.2", "qwen2.5", "deepseek-r1"],
  },
};
