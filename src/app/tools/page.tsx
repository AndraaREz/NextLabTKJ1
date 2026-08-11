import Link from "next/link";
import { Calculator, Code2, Fingerprint, Hash, Network, Radio, Server, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const tools=[["IP & Subnet Calculator","/tools/ip-calculator",Calculator],["Port Reference","/tools/ports",Radio],["JSON Formatter","/tools/json",Code2],["Base64","/tools/base64",Hash],["UUID Generator","/tools/uuid",Fingerprint],["MAC Generator","/tools/mac",Network],["CIDR Reference","/tools/cidr",Server],["VLAN Reference","/tools/vlan",Wand2]] as const;

export default function Tools(){return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><h1 className="text-3xl font-semibold">TKJ Toolbox</h1><p className="mt-2 text-muted-foreground">Utility praktis untuk latihan dan pekerjaan jaringan.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tools.map(([name,href,Icon])=><Link href={href} key={href}><Card className="h-full p-5 transition hover:border-foreground/20"><Icon className="h-5 w-5"/><h2 className="mt-5 font-medium">{name}</h2><p className="mt-2 text-sm text-muted-foreground">Buka tool.</p></Card></Link>)}</div></main>}