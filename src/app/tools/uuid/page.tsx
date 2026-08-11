"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UUID(){const [id,setId]=useState("");return <main className="mx-auto max-w-3xl px-4 py-10"><h1 className="text-3xl font-semibold">UUID Generator</h1><Card className="mt-8 p-6"><p className="break-all rounded-xl border bg-muted p-5 font-mono text-sm">{id||"Tekan Generate"}</p><Button className="mt-4" onClick={()=>setId(crypto.randomUUID())}><RefreshCw className="h-4 w-4"/>Generate</Button></Card></main>}