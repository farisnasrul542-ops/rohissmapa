import {
  SITE,
  ORG_STATS,
  ABOUT_CONTENT,
  PEMBINA_WELCOME,
  GALLERY_DATA,
} from "./constants";

export interface HomeCmsData {
  hero: {
    tag: string;
    titleLine1: string;
    titleLine2: string;
    leadPhrase: string;
    narrative: string;
    btnPrimaryText: string;
    btnPrimaryLink: string;
    btnSecondaryText: string;
    btnSecondaryLink: string;
    showcaseImageUrl?: string;
    showcaseBadge?: string;
    showcaseLocation?: string;
    showcaseTitle?: string;
    showcaseDescription?: string;
    showcaseMeta1?: string;
    showcaseMeta2?: string;
    showcaseMeta3?: string;
    infoLabel1?: string;
    infoValue1?: string;
    infoLabel2?: string;
    infoValue2?: string;
    infoLabel3?: string;
    infoValue3?: string;
  };
  stats: Array<{
    id: string;
    value: number;
    suffix: string;
    label: string;
  }>;
  about: {
    tag: string;
    title: string;
    lead: string;
    paragraph1: string;
    paragraph2: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
    photoUrl: string;
    photoBadge: string;
    quoteText: string;
    quoteAuthor: string;
  };
  sambutan: {
    tag: string;
    pembina1: {
      name: string;
      role: string;
      image: string;
      salamPembuka: string;
      paragraphs: string[];
      salamPenutup: string;
    };
    pembina2: {
      name: string;
      role: string;
      image: string;
      salamPembuka: string;
      paragraphs: string[];
      salamPenutup: string;
    };
  };
  agenda: {
    tag: string;
    title: string;
    lead: string;
    hintText: string;
  };
  gallery: {
    tag: string;
    title: string;
    lead: string;
    items: Array<{
      id: string;
      title: string;
      category: string;
      date: string;
      image: string;
      description?: string;
    }>;
  };
  closing: {
    tag: string;
    title: string;
    subtitle: string;
    btnPrimaryText: string;
    btnPrimaryLink: string;
    btnSecondaryText: string;
    btnSecondaryLink: string;
  };
  directory?: {
    title: string;
    lead: string;
    items: Array<{
      id: string;
      tag: string;
      iconName: string;
      title: string;
      shortSubtitle: string;
      description: string;
      link: string;
    }>;
  };
  sections: {
    showHero: boolean;
    showStats: boolean;
    showAbout: boolean;
    showSambutan: boolean;
    showAgenda: boolean;
    showGallery: boolean;
    showClosing: boolean;
    showDirectory?: boolean;
  };
}

export const DEFAULT_HOME_CMS: HomeCmsData = {
  hero: {
    tag: "EKSTRAKURIKULER KEAGAMAAN • SMAN 4 PURWOKERTO",
    titleLine1: "ROHIS",
    titleLine2: "PURWOKERTO",
    leadPhrase: "Membina Generasi Qur'ani, Cerdas, dan Berprestasi di Lingkungan Sekolah.",
    narrative:
      "Kerohanian Islam (ROHIS) SMA Negeri 4 Purwokerto adalah wadah pembinaan nilai-nilai Islam, ukhuwah pelajar, dan penguatan akhlak mulia bagi seluruh siswa-siswi muslim SMAPA. Berpusat di Musholla Al-Ikhlas SMAN 4 Purwokerto, kami aktif menyelenggarakan kajian Jumat, mentoring mingguan, keputrian, pembiasaan sholat berjamaah, serta bakti sosial kemanusiaan.",
    btnPrimaryText: "Profil Rohis SMAPA",
    btnPrimaryLink: "/tentang",
    btnSecondaryText: "Lihat Galeri Rohis",
    btnSecondaryLink: "/galeri",
    showcaseImageUrl: "/images/rohis-akhdir-38.jpg",
    showcaseBadge: "RBC X PECETIKAH",
    showcaseLocation: "SMAN 4 PURWOKERTO",
    showcaseTitle: "ROHIS AKHDIR 38",
    showcaseDescription:
      "Pertemuan akbar dan kaderisasi generasi ke-38 Rohis SMA Negeri 4 Purwokerto dalam merajut ukhuwah dan agenda keumatan.",
    showcaseMeta1: "RESMI • LOMBA TINGKAT KAB",
    showcaseMeta2: "2026 • PURWOKERTO",
    showcaseMeta3: "15+ SMA / SMK / MA",
    infoLabel1: "STATUS ORGANISASI",
    infoValue1: "Ekstrakurikuler Resmi",
    infoLabel2: "PUSAT KEGIATAN",
    infoValue2: "Musholla Al-Ikhlas",
    infoLabel3: "NAUNGAN SEKOLAH",
    infoValue3: "SMAN 4 Purwokerto",
  },
  stats: [
    {
      id: "stat-1",
      value: 180,
      suffix: "+",
      label: "Kader & Anggota Aktif",
    },
    {
      id: "stat-2",
      value: 6,
      suffix: "",
      label: "Divisi Kepengurusan",
    },
    {
      id: "stat-3",
      value: 14,
      suffix: "+",
      label: "Program Kerja Tahunan",
    },
    {
      id: "stat-4",
      value: 1985,
      suffix: "",
      label: "Tahun Berdiri",
    },
  ],
  about: {
    tag: ABOUT_CONTENT.tag || "TENTANG KAMI",
    title: ABOUT_CONTENT.title || "Bukan sekadar sebuah organisasi.",
    lead:
      ABOUT_CONTENT.lead ||
      "Didirikan seiring dinamika pembinaan kesiswaan di SMA Negeri 4 Purwokerto, ROHIS SMAPA tumbuh dari tekad bersama para pelajar untuk merajut ukhuwah dan memperkuat dakwah sekolah.",
    paragraph1: ABOUT_CONTENT.paragraph1,
    paragraph2: ABOUT_CONTENT.paragraph2,
    point1Title: ABOUT_CONTENT.highlights[0].title,
    point1Desc: ABOUT_CONTENT.highlights[0].desc,
    point2Title: ABOUT_CONTENT.highlights[1].title,
    point2Desc: ABOUT_CONTENT.highlights[1].desc,
    photoUrl: "/images/dokumentasi-smapa.jpg",
    photoBadge: "",
    quoteText:
      ABOUT_CONTENT.quote ||
      "Di sini kami belajar bahwa dakwah terbaik tidak diukur dari megahnya panggung, melainkan dari keteladanan akhlak dan keikhlasan melayani sesama pelajar.",
    quoteAuthor: ABOUT_CONTENT.quoteAuthor || "Catatan Lapangan Kader Pelajar, Rohis SMAPA Purwokerto",
  },
  sambutan: {
    tag: PEMBINA_WELCOME.tag || "SAMBUTAN DEWAN PEMBINA",
    pembina1: {
      name: PEMBINA_WELCOME.pembinaList[0].name,
      role: "Pembina 1",
      image: PEMBINA_WELCOME.pembinaList[0].image,
      salamPembuka: PEMBINA_WELCOME.pembinaList[0].salamPembuka,
      paragraphs: [...PEMBINA_WELCOME.pembinaList[0].paragraphs],
      salamPenutup: PEMBINA_WELCOME.pembinaList[0].salamPenutup,
    },
    pembina2: {
      name: PEMBINA_WELCOME.pembinaList[1].name,
      role: "Pembina 2",
      image: PEMBINA_WELCOME.pembinaList[1].image,
      salamPembuka: PEMBINA_WELCOME.pembinaList[1].salamPembuka,
      paragraphs: [...PEMBINA_WELCOME.pembinaList[1].paragraphs],
      salamPenutup: PEMBINA_WELCOME.pembinaList[1].salamPenutup,
    },
  },
  agenda: {
    tag: "KEGIATAN ROHIS",
    title: "Agenda & Kegiatan",
    lead: "Ruang belajar, bertumbuh, dan berbuat baik bersama.",
    hintText: "Geser untuk melihat agenda lainnya",
  },
  gallery: {
    tag: "DOKUMENTASI ROHIS",
    title: "Galeri Syiar & Ukhuwah",
    lead: "Cerita kegiatan dan kebersamaan keluarga Rohis SMAPA.",
    items: [
      {
        id: "GAL-001",
        title: "Musyawarah Kerja Anggota (MUSKERTA) 2026",
        category: "Muskerta & Raker",
        date: "12 Oktober 2026",
        image: "/images/dokumentasi-muskerta.jpg",
        description: "Penyusunan grand design dakwah sekolah dan konsolidasi 6 divisi kepengurusan Rohis SMAPA.",
      },
      {
        id: "GAL-002",
        title: "SMAN 4 MENOLONG",
        category: "Kajian",
        date: "28 Mei 2026",
        image: "/images/galeri-sman4-menolong.jpg",
        description: "Dengan rasa kemanusiaan SMAN 4 memberikan bantuan kepada korban bencana",
      },
      {
        id: "GAL-003",
        title: "Tadarus & Sholat Dhuha Berjamaah",
        category: "Peribadahan",
        date: "05 Oktober 2026",
        image: "https://iili.io/nP8LnYF.jpg#crop=53,50,0.75,cover",
        description: "Pembiasaan sholat sunnah dhuha dan tadarus juz 30 sebelum memulai kegiatan belajar mengajar.",
      },
    ],
  },
  closing: {
    tag: "Ayo Bergabung Bersama Kami!",
    title: "Jadilah Bagian dari Keluarga Besar Rohis SMAPA!",
    subtitle:
      "Tingkatkan wawasan keislaman, temukan sahabat taat di sekolah, asah keterampilan kepemimpinan, dan dapatkan pengalaman berharga di SMA Negeri 4 Purwokerto.",
    btnPrimaryText: "Lihat Agenda & Kajian",
    btnPrimaryLink: "/agenda",
    btnSecondaryText: "Tentang Kami",
    btnSecondaryLink: "/tentang",
  },
  directory: {
    title: "Direktori Layanan & Informasi",
    lead: "Geser atau pilih kartu untuk membuka halaman informasi Rohis SMAPA.",
    items: [
      {
        id: "profil",
        tag: "PROFIL & VISI",
        iconName: "BookOpen",
        title: "Profil & Sejarah Rohis",
        shortSubtitle: "Visi, misi & filosofi",
        description:
          "Mengenal visi, misi, rekam jejak perjalanan, dan pembiasaan nilai-nilai Islam rahmatan lil 'alamin di SMA Negeri 4 Purwokerto.",
        link: "/tentang",
      },
      {
        id: "kepengurusan",
        tag: "STRUKTUR ORGANISASI",
        iconName: "Users",
        title: "Dewan Pembina & Pengurus",
        shortSubtitle: "2 pembina & 44 pengurus",
        description:
          "Susunan dewan pembina guru PAI serta 44 pengurus harian (BPH) dan divisi masa bakti 2026/2027.",
        link: "/tentang#kepengurusan",
      },
      {
        id: "divisi",
        tag: "DIVISI & PROKER",
        iconName: "Layers",
        title: "6 Divisi & Program Kerja",
        shortSubtitle: "BPH, Pendidikan, Kaderisasi, Humas, Perpusmed, Sarpras",
        description:
          "Eksplorasi program kerja unggulan divisi BPH, Pendidikan, Kaderisasi, Humas, Perpusmed, dan Sarpras Rohis SMAPA.",
        link: "/program",
      },
      {
        id: "agenda",
        tag: "JADWAL & KEGIATAN",
        iconName: "Calendar",
        title: "Agenda & Kegiatan",
        shortSubtitle: "Kajian & LDKR SMAPA",
        description:
          "Jadwal kajian akbar, latihan dasar kepemimpinan (LDKR), keputrian Jumat, dan musyawarah kerja kader.",
        link: "/agenda",
      },
      {
        id: "galeri",
        tag: "DOKUMENTASI VISUAL",
        iconName: "Camera",
        title: "Galeri Syiar & Ukhuwah",
        shortSubtitle: "Dokumentasi kegiatan resmi",
        description:
          "Arsip dokumentasi visual potret kebersamaan ibadah, bakti sosial, dan momen ukhuwah pelajar SMA Negeri 4 Purwokerto.",
        link: "/galeri",
      },
    ],
  },
  sections: {
    showHero: true,
    showStats: false,
    showAbout: true,
    showSambutan: true,
    showAgenda: true,
    showGallery: true,
    showClosing: false,
  },
};

export function normalizeHomeCms(raw: any): HomeCmsData {
  if (!raw || typeof raw !== "object") return DEFAULT_HOME_CMS;

  return {
    hero: {
      tag: raw.hero?.tag || DEFAULT_HOME_CMS.hero.tag,
      titleLine1: raw.hero?.titleLine1 || DEFAULT_HOME_CMS.hero.titleLine1,
      titleLine2: raw.hero?.titleLine2 || DEFAULT_HOME_CMS.hero.titleLine2,
      leadPhrase: raw.hero?.leadPhrase || DEFAULT_HOME_CMS.hero.leadPhrase,
      narrative: raw.hero?.narrative || DEFAULT_HOME_CMS.hero.narrative,
      btnPrimaryText:
        raw.hero?.btnPrimaryText || DEFAULT_HOME_CMS.hero.btnPrimaryText,
      btnPrimaryLink:
        raw.hero?.btnPrimaryLink || DEFAULT_HOME_CMS.hero.btnPrimaryLink,
      btnSecondaryText:
        !raw.hero?.btnSecondaryText ||
        raw.hero?.btnSecondaryText === "Daftar Calon Kader" ||
        raw.hero?.btnSecondaryText === "Lihat Jadwal Agenda"
          ? "Lihat Galeri Rohis"
          : raw.hero.btnSecondaryText,
      btnSecondaryLink:
        !raw.hero?.btnSecondaryLink ||
        raw.hero?.btnSecondaryText === "Daftar Calon Kader" ||
        raw.hero?.btnSecondaryLink === "/agenda" ||
        raw.hero?.btnSecondaryLink === "/pendaftaran"
          ? "/galeri"
          : raw.hero.btnSecondaryLink,
      showcaseImageUrl:
        raw.hero?.showcaseImageUrl ||
        DEFAULT_HOME_CMS.hero.showcaseImageUrl ||
        "/images/rohis-akhdir-38.jpg",
      showcaseBadge:
        typeof raw.hero?.showcaseBadge === "string"
          ? raw.hero.showcaseBadge
          : DEFAULT_HOME_CMS.hero.showcaseBadge ?? "RBC X PECETIKAH",
      showcaseLocation:
        typeof raw.hero?.showcaseLocation === "string"
          ? raw.hero.showcaseLocation
          : DEFAULT_HOME_CMS.hero.showcaseLocation ?? "SMAN 4 PURWOKERTO",
      showcaseTitle:
        typeof raw.hero?.showcaseTitle === "string"
          ? raw.hero.showcaseTitle
          : DEFAULT_HOME_CMS.hero.showcaseTitle ?? "ROHIS AKHDIR 38",
      showcaseDescription:
        typeof raw.hero?.showcaseDescription === "string"
          ? raw.hero.showcaseDescription
          : DEFAULT_HOME_CMS.hero.showcaseDescription ??
            "Pertemuan akbar dan kaderisasi generasi ke-38 Rohis SMA Negeri 4 Purwokerto dalam merajut ukhuwah dan agenda keumatan.",
      showcaseMeta1:
        typeof raw.hero?.showcaseMeta1 === "string"
          ? raw.hero.showcaseMeta1
          : DEFAULT_HOME_CMS.hero.showcaseMeta1 ?? "RESMI • LOMBA TINGKAT KAB",
      showcaseMeta2:
        typeof raw.hero?.showcaseMeta2 === "string"
          ? raw.hero.showcaseMeta2
          : DEFAULT_HOME_CMS.hero.showcaseMeta2 ?? "2026 • PURWOKERTO",
      showcaseMeta3:
        typeof raw.hero?.showcaseMeta3 === "string"
          ? raw.hero.showcaseMeta3
          : DEFAULT_HOME_CMS.hero.showcaseMeta3 ?? "15+ SMA / SMK / MA",
      infoLabel1:
        raw.hero?.infoLabel1 ||
        DEFAULT_HOME_CMS.hero.infoLabel1 ||
        "STATUS ORGANISASI",
      infoValue1:
        raw.hero?.infoValue1 ||
        DEFAULT_HOME_CMS.hero.infoValue1 ||
        "Ekstrakurikuler Resmi",
      infoLabel2:
        raw.hero?.infoLabel2 ||
        DEFAULT_HOME_CMS.hero.infoLabel2 ||
        "PUSAT KEGIATAN",
      infoValue2:
        raw.hero?.infoValue2 ||
        DEFAULT_HOME_CMS.hero.infoValue2 ||
        "Musholla Al-Ikhlas",
      infoLabel3:
        raw.hero?.infoLabel3 ||
        DEFAULT_HOME_CMS.hero.infoLabel3 ||
        "NAUNGAN SEKOLAH",
      infoValue3:
        raw.hero?.infoValue3 ||
        DEFAULT_HOME_CMS.hero.infoValue3 ||
        "SMAN 4 Purwokerto",
    },
    stats:
      Array.isArray(raw.stats) && raw.stats.length > 0
        ? raw.stats
        : DEFAULT_HOME_CMS.stats,
    about: {
      tag: raw.about?.tag || DEFAULT_HOME_CMS.about.tag,
      title: raw.about?.title || DEFAULT_HOME_CMS.about.title,
      lead: raw.about?.lead || DEFAULT_HOME_CMS.about.lead,
      paragraph1: raw.about?.paragraph1 || DEFAULT_HOME_CMS.about.paragraph1,
      paragraph2: raw.about?.paragraph2 || DEFAULT_HOME_CMS.about.paragraph2,
      point1Title: raw.about?.point1Title || DEFAULT_HOME_CMS.about.point1Title,
      point1Desc: raw.about?.point1Desc || DEFAULT_HOME_CMS.about.point1Desc,
      point2Title: raw.about?.point2Title || DEFAULT_HOME_CMS.about.point2Title,
      point2Desc: raw.about?.point2Desc || DEFAULT_HOME_CMS.about.point2Desc,
      photoUrl:
        raw.about?.photoUrl && !raw.about.photoUrl.includes("muskerta")
          ? raw.about.photoUrl
          : DEFAULT_HOME_CMS.about.photoUrl,
      photoBadge:
        raw.about?.photoBadge && !raw.about.photoBadge.toUpperCase().includes("MUSKERTA")
          ? raw.about.photoBadge
          : "",
      quoteText: raw.about?.quoteText || DEFAULT_HOME_CMS.about.quoteText,
      quoteAuthor: raw.about?.quoteAuthor || DEFAULT_HOME_CMS.about.quoteAuthor,
    },
    sambutan: {
      tag: raw.sambutan?.tag || DEFAULT_HOME_CMS.sambutan.tag,
      pembina1: {
        name:
          raw.sambutan?.pembina1?.name &&
          raw.sambutan.pembina1.name !== "Drs. H. Sugeng Riyadi, M.Pd.I"
            ? raw.sambutan.pembina1.name
            : DEFAULT_HOME_CMS.sambutan.pembina1.name,
        role:
          raw.sambutan?.pembina1?.role ||
          DEFAULT_HOME_CMS.sambutan.pembina1.role,
        image:
          raw.sambutan?.pembina1?.image &&
          !raw.sambutan.pembina1.image.includes("pembina_1")
            ? raw.sambutan.pembina1.image
            : DEFAULT_HOME_CMS.sambutan.pembina1.image,
        salamPembuka:
          raw.sambutan?.pembina1?.salamPembuka ||
          DEFAULT_HOME_CMS.sambutan.pembina1.salamPembuka,
        paragraphs: Array.isArray(raw.sambutan?.pembina1?.paragraphs)
          ? raw.sambutan.pembina1.paragraphs
          : DEFAULT_HOME_CMS.sambutan.pembina1.paragraphs,
        salamPenutup:
          raw.sambutan?.pembina1?.salamPenutup ||
          DEFAULT_HOME_CMS.sambutan.pembina1.salamPenutup,
      },
      pembina2: {
        name:
          raw.sambutan?.pembina2?.name &&
          raw.sambutan.pembina2.name !== "Dra. Hj. Siti Fatimah"
            ? raw.sambutan.pembina2.name
            : DEFAULT_HOME_CMS.sambutan.pembina2.name,
        role:
          raw.sambutan?.pembina2?.role ||
          DEFAULT_HOME_CMS.sambutan.pembina2.role,
        image:
          raw.sambutan?.pembina2?.image &&
          !raw.sambutan.pembina2.image.includes("pembina_2")
            ? raw.sambutan.pembina2.image
            : DEFAULT_HOME_CMS.sambutan.pembina2.image,
        salamPembuka:
          raw.sambutan?.pembina2?.salamPembuka ||
          DEFAULT_HOME_CMS.sambutan.pembina2.salamPembuka,
        paragraphs: Array.isArray(raw.sambutan?.pembina2?.paragraphs)
          ? raw.sambutan.pembina2.paragraphs
          : DEFAULT_HOME_CMS.sambutan.pembina2.paragraphs,
        salamPenutup:
          raw.sambutan?.pembina2?.salamPenutup ||
          DEFAULT_HOME_CMS.sambutan.pembina2.salamPenutup,
      },
    },
    agenda: {
      tag: raw.agenda?.tag || DEFAULT_HOME_CMS.agenda.tag,
      title: raw.agenda?.title || DEFAULT_HOME_CMS.agenda.title,
      lead: raw.agenda?.lead || DEFAULT_HOME_CMS.agenda.lead,
      hintText: raw.agenda?.hintText || DEFAULT_HOME_CMS.agenda.hintText,
    },
    gallery: {
      tag: raw.gallery?.tag || DEFAULT_HOME_CMS.gallery.tag,
      title: raw.gallery?.title || DEFAULT_HOME_CMS.gallery.title,
      lead: raw.gallery?.lead || DEFAULT_HOME_CMS.gallery.lead,
      items:
        Array.isArray(raw.gallery?.items) && raw.gallery.items.length > 0
          ? raw.gallery.items
          : DEFAULT_HOME_CMS.gallery.items,
    },
    closing: {
      tag: raw.closing?.tag || DEFAULT_HOME_CMS.closing.tag,
      title: raw.closing?.title || DEFAULT_HOME_CMS.closing.title,
      subtitle: raw.closing?.subtitle || DEFAULT_HOME_CMS.closing.subtitle,
      btnPrimaryText:
        raw.closing?.btnPrimaryText || DEFAULT_HOME_CMS.closing.btnPrimaryText,
      btnPrimaryLink:
        raw.closing?.btnPrimaryLink || DEFAULT_HOME_CMS.closing.btnPrimaryLink,
      btnSecondaryText:
        raw.closing?.btnSecondaryText ||
        DEFAULT_HOME_CMS.closing.btnSecondaryText,
      btnSecondaryLink:
        raw.closing?.btnSecondaryLink ||
        DEFAULT_HOME_CMS.closing.btnSecondaryLink,
    },
    directory: {
      title: raw.directory?.title || DEFAULT_HOME_CMS.directory!.title,
      lead: raw.directory?.lead || DEFAULT_HOME_CMS.directory!.lead,
      items:
        Array.isArray(raw.directory?.items) && raw.directory.items.length > 0
          ? raw.directory.items.filter((item: any) => item?.id !== "musholla")
          : DEFAULT_HOME_CMS.directory!.items,
    },
    sections: {
      showHero: raw.sections?.showHero !== false,
      showStats: false,
      showAbout: raw.sections?.showAbout !== false,
      showSambutan: raw.sections?.showSambutan !== false,
      showAgenda: raw.sections?.showAgenda !== false,
      showGallery: raw.sections?.showGallery !== false,
      showClosing: raw.sections?.showClosing !== false,
      showDirectory: raw.sections?.showDirectory !== false,
    },
  };
}
