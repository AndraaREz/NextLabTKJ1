"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function JSONTool(){const [value,setValue]=useState('{"name":"NETLAB","type":"TKJ"}');const [out,setOut]=useState("");const [error,setError]=useState("");function format(){try{setOut(JSON.stringify(JSON.parse(value),null,2));setError("")}catch{setError("JSON tidak valid.")}}return <main className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-semibold">JSON Formatter</h1><Card className="mt-8 p-5"><textarea value={value} onChange={e=>setValue(e.target.value)} className="min-h-48 w-full rounded-xl border bg-background p-4 font-mono text-sm"/><Button className="mt-4" onClick={format}>Format JSON</Button>{error&&<p className="mt-3 text-sm text-danger">{error}</p>}{out&&<pre className="mt-5 overflow-auto rounded-xl border bg-muted p-4 text-sm">{out}</pre>}</Card></main>}