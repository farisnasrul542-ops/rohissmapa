export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: "Kajian" | "MABIT" | "Pelatihan" | "Sosial" | "Lomba";
  date: string;
  time: string;
  location: string;
  speaker?: string;
  speakerRole?: string;
  quota: number;
  registered: number;
  status: "open" | "closing_soon" | "full" | "completed";
  image: string;
  description: string;
  isFeatured?: boolean;
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: "Dakwah" | "Kisah Inspirasi" | "Tips & Trik" | "Opini Pelajar";
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface SchoolItem {
  id: string;
  slug: string;
  name: string;
  rohisName: string;
  type: "SMA" | "SMK" | "MA";
  region: "Purwokerto Utara" | "Purwokerto Selatan" | "Purwokerto Timur" | "Banyumas" | "Ajibarang" | "Sokaraja" | "Wangon";
  address: string;
  activeMembers: number;
  leader: string;
  instagram: string;
  logoText: string;
  accentColor: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  category: "Ibadah" | "Adab & Akhlak" | "Dakwah Sekolah" | "Muamalah";
  askedBy: string;
  school: string;
  answeredBy: string;
  asatidzRole: string;
  date: string;
  views: number;
}

export interface PengurusMember {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  division: string;
  classGrade: string;
  period: string;
  image: string;
  sashTitle?: string;
  instagram?: string;
  whatsapp?: string;
  phone?: string;
  quote?: string;
  isBph?: boolean;
}
