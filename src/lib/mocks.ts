// Mock data for SunnyvaleConnect prototype.
// Replace with real API calls (base URL: http://0.0.0.0:8000) when backend is ready.

export type Priority = "low" | "medium" | "high";

export interface NewsItem {
  id: number;
  description: string;
  author: string;
  priority_level: Priority;
  created_at: string;
  updated_at: string;
  body?: string;
}

export interface Reservation {
  id: number;
  reservation_user: number;
  reservation_date: string;
  guest_count: number;
  status: "confirmed" | "pending" | "cancelled";
}

export interface Visitor {
  id: number;
  visitor_name: string;
  email: string;
  scheduled_date: string;
  checkin_date_time?: string;
  checkout_date_time?: string;
  checkin_code: string;
  checkout_code: string;
  status: "agendado" | "presente" | "finalizado" | "cancelado";
  description: string;
  link_checkin: string;
  link_checkout: string;
  host_user: number;
}

export interface Payment {
  id: number;
  title: string;
  status: "pendente" | "pago" | "atrasado";
  description: string;
  payment_link: string;
  payment_date: string;
  due_date: string;
  amount: number;
  payer_user: number;
}

export interface Delivery {
  id: number;
  carrier: string;
  description: string;
  status: "recebida" | "retirada" | "aguardando";
  date: string;
}

export interface ServiceRequest {
  id: number;
  title: string;
  category: string;
  description: string;
  status: "aberto" | "em_andamento" | "resolvido" | "cancelado";
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  unit?: string;
}

export const currentUser: User = {
  id: 1,
  username: "morador",
  first_name: "Lucas",
  last_name: "Almeida",
  email: "lucas.almeida@sunnyvale.com",
  unit: "Bloco B • Apto 304",
};

export const news: NewsItem[] = [
  {
    id: 1,
    description: "Manutenção programada da caixa d'água nesta quinta-feira",
    author: "Síndico",
    priority_level: "high",
    created_at: "2026-05-24T09:00:00",
    updated_at: "2026-05-24T09:00:00",
    body: "Informamos que a manutenção da caixa d'água ocorrerá das 8h às 14h. O fornecimento de água será interrompido neste período. Recomendamos armazenar água potável com antecedência.",
  },
  {
    id: 2,
    description: "Nova área de coworking disponível no térreo",
    author: "Administração",
    priority_level: "medium",
    created_at: "2026-05-22T14:30:00",
    updated_at: "2026-05-22T14:30:00",
    body: "A partir desta semana, o espaço de coworking está aberto para os moradores das 7h às 22h. Wi-Fi de alta velocidade e estações com monitores disponíveis.",
  },
  {
    id: 3,
    description: "Festa junina do condomínio — venha participar!",
    author: "Comissão de Eventos",
    priority_level: "low",
    created_at: "2026-05-20T18:00:00",
    updated_at: "2026-05-20T18:00:00",
    body: "Dia 14 de junho às 18h, no salão de festas. Quadrilha, comidas típicas e brincadeiras para as crianças.",
  },
  {
    id: 4,
    description: "Atualização do regulamento interno disponível",
    author: "Síndico",
    priority_level: "low",
    created_at: "2026-05-18T10:00:00",
    updated_at: "2026-05-18T10:00:00",
    body: "A versão revisada está disponível na portaria e no portal do morador.",
  },
];

export const bbqReservations: Reservation[] = [
  { id: 1, reservation_user: 1, reservation_date: "2026-06-07", guest_count: 12, status: "confirmed" },
  { id: 2, reservation_user: 1, reservation_date: "2026-07-15", guest_count: 8, status: "pending" },
];

export const hallReservations: Reservation[] = [
  { id: 1, reservation_user: 1, reservation_date: "2026-06-21", guest_count: 40, status: "confirmed" },
];

export const visitors: Visitor[] = [
  {
    id: 1,
    visitor_name: "Mariana Souza",
    email: "mariana@example.com",
    scheduled_date: "2026-05-26T19:00:00",
    checkin_code: "VIS-AB12",
    checkout_code: "OUT-AB12",
    status: "agendado",
    description: "Jantar de família",
    link_checkin: "https://sv.app/c/AB12",
    link_checkout: "https://sv.app/o/AB12",
    host_user: 1,
  },
  {
    id: 2,
    visitor_name: "Carlos Mendes",
    email: "carlos@example.com",
    scheduled_date: "2026-05-25T14:00:00",
    checkin_date_time: "2026-05-25T14:05:00",
    checkin_code: "VIS-CD34",
    checkout_code: "OUT-CD34",
    status: "presente",
    description: "Técnico de ar condicionado",
    link_checkin: "https://sv.app/c/CD34",
    link_checkout: "https://sv.app/o/CD34",
    host_user: 1,
  },
];

export const payments: Payment[] = [
  {
    id: 1,
    title: "Taxa condominial — Maio/2026",
    status: "pendente",
    description: "Mensalidade ordinária do mês de maio.",
    payment_link: "https://pay.sunnyvale.com/1",
    payment_date: "",
    due_date: "2026-05-31",
    amount: 685.5,
    payer_user: 1,
  },
  {
    id: 2,
    title: "Taxa condominial — Abril/2026",
    status: "pago",
    description: "Pagamento confirmado.",
    payment_link: "https://pay.sunnyvale.com/2",
    payment_date: "2026-04-28",
    due_date: "2026-04-30",
    amount: 685.5,
    payer_user: 1,
  },
  {
    id: 3,
    title: "Rateio de obras — Pintura fachada",
    status: "atrasado",
    description: "Parcela 1 de 3.",
    payment_link: "https://pay.sunnyvale.com/3",
    payment_date: "",
    due_date: "2026-05-10",
    amount: 240,
    payer_user: 1,
  },
];

export const deliveries: Delivery[] = [
  { id: 1, carrier: "Correios", description: "Encomenda PAC", status: "recebida", date: "2026-05-24T11:20:00" },
  { id: 2, carrier: "Mercado Livre", description: "Caixa pequena", status: "aguardando", date: "2026-05-25T16:00:00" },
  { id: 3, carrier: "iFood", description: "Sacola de mercado", status: "retirada", date: "2026-05-23T20:10:00" },
];

export const serviceRequests: ServiceRequest[] = [
  { id: 1, title: "Lâmpada queimada no corredor 3º andar", category: "Manutenção", description: "Lâmpada do corredor principal está piscando.", status: "em_andamento", created_at: "2026-05-22T08:00:00" },
  { id: 2, title: "Solicitação de chave reserva", category: "Portaria", description: "Preciso de uma cópia para uso emergencial.", status: "aberto", created_at: "2026-05-24T15:30:00" },
];

export function formatDate(iso: string, withTime = false): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  if (!withTime) return date;
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} • ${time}`;
}

export function formatCurrency(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
