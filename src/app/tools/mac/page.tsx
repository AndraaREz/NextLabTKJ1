"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
function mac(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,"0")).join(":").toUpperCase()}
export default function MAC(){const [v,setV]=useState("");return <main className="mx-auto max-w-3xl px-4 py-10"><h1 className="text-3xl font-semibold">MAC Generator</h1><Card className="mt-8 p-6"><p className="rounded-xl border bg-muted p-5 font-mono">{v||"00:00:00:00:00:00"}</p><Button className="mt-4" onClick={()=>setV(mac())}>Generate MAC</Button></Card></main>}