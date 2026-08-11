import { LessonClient } from "@/components/learning/lesson-client";

const lessons: Record<string, { title: string; body: string[] }> = {
  osi: { title: "OSI Model", body: ["OSI membagi komunikasi jaringan menjadi tujuh layer: Physical, Data Link, Network, Transport, Session, Presentation, dan Application.", "Untuk praktik TKJ, fokus awal pada Physical, Data Link, Network, Transport, dan Application."] },
  "tcp-ip": { title: "TCP/IP", body: ["Model TCP/IP menyederhanakan komunikasi menjadi Link, Internet, Transport, dan Application.", "IP bekerja pada Internet layer, sedangkan TCP dan UDP berada pada Transport layer."] },
  "ip-addressing": { title: "IP Addressing", body: ["IPv4 terdiri dari 32 bit dan biasanya ditulis sebagai empat oktet desimal.", "Prefix CIDR menentukan bagian network dan host."] },
  subnetting: { title: "Subnetting", body: ["Subnetting membagi sebuah network menjadi beberapa network yang lebih kecil.", "Gunakan NETLAB IP Calculator untuk melihat network, broadcast, dan host range."] },
  vlan: { title: "VLAN", body: ["VLAN memisahkan broadcast domain secara logis pada switch.", "Port access biasanya berada pada satu VLAN, sedangkan trunk membawa beberapa VLAN."] },
  dhcp: { title: "DHCP", body: ["DHCP dapat memberikan IP address, subnet mask, gateway, dan DNS secara otomatis kepada client.", "DORA adalah Discover, Offer, Request, Acknowledge."] },
  dns: { title: "DNS", body: ["DNS menerjemahkan nama domain menjadi informasi seperti alamat IP.", "Port umum DNS adalah 53 UDP/TCP."] },
  routing: { title: "Routing", body: ["Routing menentukan jalur paket dari satu network menuju network lain.", "Routing dapat berupa static route atau dynamic routing protocol."] },
  nat: { title: "NAT", body: ["NAT menerjemahkan alamat IP antara ruang alamat yang berbeda dan umum digunakan saat jaringan private mengakses internet."] },
  firewall: { title: "Firewall", body: ["Firewall menerapkan aturan untuk mengizinkan atau memblokir traffic berdasarkan parameter seperti source, destination, protocol, dan port."] },
};

export default async function Lesson({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons[slug];

  if (!lesson) {
    return <LessonClient slug={slug} title="Materi belum tersedia" body={["Materi ini belum dibuat."]} />;
  }

  return <LessonClient slug={slug} title={lesson.title} body={lesson.body} />;
}
