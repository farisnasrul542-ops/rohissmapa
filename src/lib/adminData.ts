import { EventItem } from "./types";
import { EVENTS_DATA } from "./constants";

export interface StudentApplicant {
  id: string;
  name: string;
  nisn: string;
  gender: "Laki-laki" | "Perempuan";
  classGrade: string;
  classRoom: string;
  whatsapp: string;
  email: string;
  divisionInterest: string;
  motivation: string;
  registeredAt: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
}

export interface StudentAspirasi {
  id: string;
  title: string;
  senderName: string;
  senderClass: string;
  isAnonymous: boolean;
  category: "Program Dakwah & Kajian" | "Fasilitas Musholla Al-Ikhlas" | "Konseling & Curhat" | "Saran & Kritik";
  message: string;
  contact?: string;
  createdAt: string;
  status: "pending" | "in_review" | "resolved";
  adminReply?: string;
  repliedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  imageUrl: string;
  caption: string;
}

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  type: "info" | "urgent" | "event";
  updatedAt: string;
}

export const INITIAL_APPLICANTS: StudentApplicant[] = [
  {
    id: "APP-001",
    name: "Muhammad Fadhil Al-Ghifari",
    nisn: "0082391024",
    gender: "Laki-laki",
    classGrade: "X (Fase E)",
    classRoom: "X-2",
    whatsapp: "081234567891",
    email: "fadhil.ghifari@gmail.com",
    divisionInterest: "Divisi Pendidikan",
    motivation: "Ingin berkontribusi memakmurkan Musholla Al-Ikhlas dan memperdalam hafalan juz 30 bersama ikhwan SMAPA.",
    registeredAt: "18 Okt 2026, 14:20",
    status: "pending",
  },
  {
    id: "APP-002",
    name: "Annisa Rahmawati Putri",
    nisn: "0083419082",
    gender: "Perempuan",
    classGrade: "X (Fase E)",
    classRoom: "X-5",
    whatsapp: "085741239845",
    email: "annisa.rahma@gmail.com",
    divisionInterest: "Divisi Humas",
    motivation: "Tertarik memperluas relasi persahabatan solehah dan aktif dalam kegiatan kemitraan dakwah pelajar SMAPA.",
    registeredAt: "18 Okt 2026, 16:05",
    status: "approved",
    adminNotes: "Disetujui oleh Koordinator Humas. Diundang ke grup WA calon kader.",
  },
  {
    id: "APP-003",
    name: "Ahmad Rayhan Dzaki",
    nisn: "0078291034",
    gender: "Laki-laki",
    classGrade: "XI (Fase F)",
    classRoom: "XI MIPA 3",
    whatsapp: "082198745612",
    email: "rayhan.dzaki@gmail.com",
    divisionInterest: "Divisi Perpusmed",
    motivation: "Memiliki keahlian desain poster di Canva/Photoshop dan video reels, ingin berdakwah lewat konten kreatif digital Rohis.",
    registeredAt: "17 Okt 2026, 19:40",
    status: "approved",
    adminNotes: "Kandidat tim desainer media sosial Rohis SMAPA.",
  },
  {
    id: "APP-004",
    name: "Nabila Zahra Syahrani",
    nisn: "0085123901",
    gender: "Perempuan",
    classGrade: "X (Fase E)",
    classRoom: "X-1",
    whatsapp: "081390823411",
    email: "nabila.zahra@gmail.com",
    divisionInterest: "Divisi Kaderisasi",
    motivation: "Ingin belajar kepemimpinan Islam dan memperluas relasi persahabatan solehah di SMA Negeri 4 Purwokerto.",
    registeredAt: "17 Okt 2026, 11:15",
    status: "pending",
  },
  {
    id: "APP-005",
    name: "Daffa Rizqy Pratama",
    nisn: "0089128392",
    gender: "Laki-laki",
    classGrade: "X (Fase E)",
    classRoom: "X-4",
    whatsapp: "089672341829",
    email: "daffa.rizqy@gmail.com",
    divisionInterest: "Divisi Humas",
    motivation: "Senang kegiatan bakti sosial dan ingin ikut menyalurkan bantuan peduli dhuafa di sekitar Banyumas.",
    registeredAt: "16 Okt 2026, 09:30",
    status: "pending",
  },
  {
    id: "APP-006",
    name: "Salma Aulia Ramadhani",
    nisn: "0079482710",
    gender: "Perempuan",
    classGrade: "XI (Fase F)",
    classRoom: "XI IPS 1",
    whatsapp: "087812938472",
    email: "salma.aulia@gmail.com",
    divisionInterest: "Divisi Pendidikan",
    motivation: "Ingin memperdalam tahsin tartil Al-Qur'an dan membantu program tadarus pagi di kelas.",
    registeredAt: "15 Okt 2026, 13:45",
    status: "approved",
    adminNotes: "Lulus verifikasi berkas.",
  },
];

export const INITIAL_ASPIRASI: StudentAspirasi[] = [
  {
    id: "ASP-001",
    title: "Penambahan Jadwal Kajian Fiqih Praktis Sholat",
    senderName: "Hamba Allah (Siswa X-3)",
    senderClass: "Kelas X",
    isAnonymous: true,
    category: "Program Dakwah & Kajian",
    message: "Assalamu'alaikum Pengurus Rohis SMAPA, usul dong diadakan kajian fiqih sholat praktis beserta cara sujud sahwi dan sholat jenazah setelah pulang sekolah hari Rabu. Banyak teman yang masih ragu bacaan dan tata caranya. Terima kasih!",
    createdAt: "19 Okt 2026, 08:30",
    status: "in_review",
    adminReply: "Wa'alaikumsalam wr wb. Usulan sangat bagus! Divisi Syiar sedang mengagendakan materi ini pada Kajian Dhuha & Fiqih Praktis bersama Ustadz pembina.",
    repliedAt: "19 Okt 2026, 10:15",
  },
  {
    id: "ASP-002",
    title: "Pewangi dan Karpet Tambahan di Musholla Al-Ikhlas",
    senderName: "Rizky Ramadhan",
    senderClass: "Kelas XI MIPA 2",
    isAnonymous: false,
    category: "Fasilitas Musholla Al-Ikhlas",
    message: "Saran untuk pengurus takmir Rohis: Karpet shaf depan putra agak lembab setelah sholat Dzuhur karena jendela sempat kena tempias hujan. Mohon bisa dijemur atau dipasang pewangi otomatis. Jazakallah khair.",
    contact: "081223344556",
    createdAt: "18 Okt 2026, 14:10",
    status: "resolved",
    adminReply: "Alhamdulillah sudah ditindaklanjuti sore kemarin oleh tim piket Musholla Al-Ikhlas. Karpet sudah dikeringkan dan diffuser pewangi kasturi sudah dipasang. Syukron masukannya!",
    repliedAt: "18 Okt 2026, 17:00",
  },
  {
    id: "ASP-003",
    title: "Konseling Mengatasi Rasa Malas Belajar dan Menjaga Hafalan",
    senderName: "Siswi Muslimah",
    senderClass: "Kelas XII MIPA",
    isAnonymous: true,
    category: "Konseling & Curhat",
    message: "Bismillah kak, saya kelas 12 mau menghadapi ujian dan SNBP tapi sering overthinking dan susah istiqomah tilawah. Apakah Rohis punya sesi sharing santai atau bimbingan dari kakak pembina keputrian?",
    createdAt: "17 Okt 2026, 21:05",
    status: "pending",
  },
  {
    id: "ASP-004",
    title: "Request Lomba Cerdas Cermat Islam Antarkelas saat Classmeeting",
    senderName: "Faturrahman",
    senderClass: "Kelas XI IPS 2",
    isAnonymous: false,
    category: "Program Dakwah & Kajian",
    message: "Usul min, nanti pas classmeeting semester ganjil Rohis SMAPA bikin Lomba Cerdas Cermat Islam dan Tahfidz antarkelas biar semakin seru dan syiarnya terasa di seluruh penjuru SMAPA.",
    contact: "085899887766",
    createdAt: "16 Okt 2026, 12:40",
    status: "resolved",
    adminReply: "Sudah dimasukkan ke dalam proposal Muskerta dan koordinasi dengan OSIS MPK SMAPA. Tunggu tanggal mainnya ya!",
    repliedAt: "17 Okt 2026, 09:00",
  },
];

export const INITIAL_ANNOUNCEMENT: BroadcastAnnouncement = {
  id: "ANN-001",
  title: "Pendaftaran Anggota Baru & Kajian Rutin Jumat SMAPA",
  content: "Open Recruitment Kader Rohis SMAN 4 Purwokerto Periode 2026/2027 resmi dibuka. Kajian Rutin Jumat Ba'da Sholat di Musholla Al-Ikhlas mengusung tema 'Adab Penuntut Ilmu'.",
  isActive: true,
  type: "info",
  updatedAt: "19 Okt 2026",
};

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "GAL-001",
    title: "Musyawarah Kerja Anggota (MUSKERTA) 2026",
    category: "Muskerta & Raker",
    date: "12 Oktober 2026",
    location: "Aula Pertemuan SMAN 4 Purwokerto",
    imageUrl: "/images/dokumentasi-muskerta.jpg",
    caption: "Penyusunan grand design dakwah sekolah dan konsolidasi 6 divisi kepengurusan Rohis SMAPA.",
  },
  {
    id: "GAL-002",
    title: "Kajian Akbar Pelajar SMAPA",
    category: "Kajian",
    date: "28 September 2026",
    location: "Musholla Al-Ikhlas SMAPA",
    imageUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
    caption: "Antusiasme ratusan siswa dalam menyimak sirah nabawiyah dan kiat menjaga adab di sekolah.",
  },
  {
    id: "GAL-003",
    title: "Tadarus & Sholat Dhuha Berjamaah",
    category: "Peribadahan",
    date: "05 Oktober 2026",
    location: "Musholla Al-Ikhlas SMAPA",
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop",
    caption: "Pembiasaan sholat sunnah dhuha dan tadarus juz 30 sebelum memulai kegiatan belajar mengajar.",
  },
  {
    id: "GAL-004",
    title: "Mentoring & Halaqah Pelajar Muslim",
    category: "Kaderisasi",
    date: "15 Oktober 2026",
    location: "Gazebo Taman SMAPA",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000&auto=format&fit=crop",
    caption: "Lingkaran mentoring pekanan yang interaktif membimbing karakter dan kepemimpinan akhlak siswa.",
  },
];
