"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, Network, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Calculator, title: "TKJ Toolbox", text: "Subnet, CIDR, IP range, ports, JSON, Base64, UUID, dan utility jaringan." },
  { icon: Network, title: "Network Lab", text: "Workspace topology untuk latihan IP, VLAN, DHCP, routing, dan konektivitas." },
  { icon: BookOpen, title: "Learning & Quiz", text: "Materi TKJ terstruktur dengan latihan dan pencatatan hasil belajar." },
  { icon: Sparkles, title: "Multi-AI", text: "Pilih Gemini, GPT, Claude, Grok, DeepSeek, Qwen, atau Ollama." }
];

export default function Home() {
  return <main>
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8">
      <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.35}} className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-accent"/> TKJ Network Lab & Toolbox</div>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">Learn. Build.<br/><span className="text-muted-foreground">Connect.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Platform modern untuk belajar jaringan komputer, mencoba tools TKJ, membangun topology, mengerjakan quiz, dan bertanya kepada AI.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard"><Button className="w-full sm:w-auto">Open Dashboard <ArrowRight className="h-4 w-4"/></Button></Link>
          <Link href="/tools"><Button variant="secondary" className="w-full sm:w-auto">Explore Toolbox</Button></Link>
        </div>
      </motion.div>
      <div className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-2">
        {features.map((f,i) => { const Icon=f.icon; return <motion.div key={f.title} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*.06,duration:.3}}><Card className="h-full p-6 transition hover:border-foreground/20"><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><Icon className="h-5 w-5"/></div><h2 className="font-medium">{f.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{f.text}</p></Card></motion.div>})}
      </div>
    </section>
    <section className="border-t"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="flex items-center gap-3 text-muted-foreground"><Terminal className="h-5 w-5"/><span className="text-sm">Built for TKJ practice</span></div></div></section>
  </main>;
}