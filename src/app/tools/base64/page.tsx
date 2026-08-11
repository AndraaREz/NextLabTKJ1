"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Base64(){const [v,setV]=useState("");const [o,setO]=useState("");return <main className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-semibold">Base64</h1><Card className="mt-8 p-5"><textarea value={v} onChange={e=>setV(e.target.value)} className="min-h-40 w-full rounded-xl border bg-background p-4"/><div className="mt-4 flex flex-wrap gap-2"><Button onClick={()=>setO(btoa(unescape(encodeURIComponent(v))))}>Encode</Button><Button variant="secondary" onClick={()=>{try{setO(decodeURIComponent(escape(atob(v))))}catch{setO("Input Base64 tidak valid.")}}}>Decode</Button></div><pre className="mt-5 whitespace-pre-wrap break-words rounded-xl border bg-muted p-4 text-sm">{o}</pre></Card></main>}