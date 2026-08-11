"use client";
import { useState } from "react";
import { subnetInfo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function IPCalculator(){
 const [ip,setIp]=useState("192.168.1.10"); const [prefix,setPrefix]=useState("24"); const [result,setResult]=useState<ReturnType<typeof subnetInfo>|null>(null); const [error,setError]=useState("");
 function calc(){try{setError("");setResult(subnetInfo(ip,Number(prefix)))}catch(e){setError(e instanceof Error?e.message:"Input tidak valid.")}}
 return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><h1 className="text-3xl font-semibold">IP & Subnet Calculator</h1><p className="mt-2 text-muted-foreground">Hitung network, broadcast, host range, dan subnet mask.</p><Card className="mt-8 p-6"><div className="grid gap-4 sm:grid-cols-3"><label className="text-sm sm:col-span-2">IPv4<input value={ip} onChange={e=>setIp(e.target.value)} className="mt-2 h-11 w-full rounded-xl border bg-background px-3"/></label><label className="text-sm">CIDR<input value={prefix} onChange={e=>setPrefix(e.target.value)} className="mt-2 h-11 w-full rounded-xl border bg-background px-3"/></label></div><Button className="mt-5" onClick={calc}>Calculate</Button>{error&&<p className="mt-4 text-sm text-danger">{error}</p>}</Card>{result&&<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(result).map(([k,v])=><Card key={k} className="p-5"><p className="text-xs uppercase text-muted-foreground">{k}</p><p className="mt-2 text-lg font-medium">{String(v)}</p></Card>)}</div>}</main>
}