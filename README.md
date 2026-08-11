# NETLAB — TKJ Network Lab

Platform Next.js untuk belajar jaringan komputer, tools TKJ, learning, quiz, lab, autentikasi, dan AI multi-provider.

## Yang sudah disiapkan

- Next.js App Router + TypeScript + Tailwind
- Responsive navbar + mobile menu yang benar-benar membuka/menutup
- Login Google dan GitHub melalui Supabase OAuth
- Sign up / login username + password
- Supabase database schema untuk profiles, class, quiz results, dan learning progress
- Dashboard progress mengambil data dari Supabase, bukan progress palsu 33%
- AI model picker:
  - Gemini
  - GPT / OpenAI
  - Claude / Anthropic
  - Grok / xAI
  - DeepSeek
  - Qwen
  - GitHub Models / Copilot-style access
  - Ollama
- Semua secret AI dipanggil dari server route `/api/ai`, jadi API key tidak dikirim ke browser.
- `.env.example` sudah disiapkan.

## 1. Jalankan lokal

```bash
npm install
npm run dev
```

## 2. Supabase

Buat project di Supabase, lalu jalankan isi:

```text
supabase/schema.sql
```

di SQL Editor.

Masukkan:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Username + password

Flow username memakai email teknis:

```text
username@auth.netlab.local
```

Karena email tersebut bukan inbox nyata, untuk flow ini nonaktifkan **Email Confirmations** di Supabase Auth.

### Google / GitHub OAuth

Aktifkan provider Google dan GitHub di Supabase Auth, lalu tambahkan callback URL:

```text
https://DOMAIN-KAMU.vercel.app/auth/callback
```

Untuk local:

```text
http://localhost:3000/auth/callback
```

Redirect URL harus juga dimasukkan ke konfigurasi URL/Redirect di Supabase.

## 3. AI di Vercel

Buka:

**Vercel → Project → Settings → Environment Variables**

Tambahkan hanya key yang memang kamu punya:

```text
GEMINI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
XAI_API_KEY=
DEEPSEEK_API_KEY=
QWEN_API_KEY=
GITHUB_MODELS_TOKEN=
OLLAMA_BASE_URL=
OLLAMA_API_KEY=
```

Setelah menambah/mengubah environment variable, lakukan redeploy.

### Tentang "free"

Tidak semua provider memberikan API gratis permanen. Gemini memiliki free tier untuk model tertentu, sedangkan GitHub Models menyediakan penggunaan gratis yang dibatasi rate limit. Provider lain dapat memiliki trial/free credits atau membutuhkan billing sesuai akun dan model.

### Ollama

Ollama gratis sebagai software lokal. Saat aplikasi dijalankan di Vercel, `127.0.0.1` berarti server Vercel, bukan HP/PC kamu. Untuk memakai Ollama dari deployment cloud, kamu perlu endpoint Ollama yang memang dapat diakses server dan diamankan.

## 4. Deploy Vercel

Repository GitHub tinggal di-import ke Vercel.

Framework preset:

```text
Next.js
```

Build command:

```text
npm run build
```

Install command:

```text
npm install
```

Output:

```text
.next
```

## 5. Git

```bash
git add .
git commit -m "Finish NETLAB platform"
git push
```

Jangan commit `.env.local`.

---

### Catatan keamanan

API key jangan ditaruh di file `src/`, `page.tsx`, browser code, atau variable `NEXT_PUBLIC_*`. Semua provider AI di project ini dipanggil melalui server route `/api/ai`.
