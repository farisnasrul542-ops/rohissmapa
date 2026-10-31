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
  sections: {
    showHero: boolean;
    showStats: boolean;
    showAbout: boolean;
    showSambutan: boolean;
    showAgenda: boolean;
    showGallery: boolean;
    showClosing: boolean;
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
    tag: "AGENDA KEGIATAN",
    title: "Agenda & Kajian Rohis SMAPA",
    lead: "Informasi jadwal kegiatan, pembinaan syiar, dan kajian dakwah pelajar di lingkungan SMA Negeri 4 Purwokerto.",
    hintText: "Klik kartu samping atau gunakan tombol panah untuk agenda lain ›",
  },
  gallery: {
    tag: "Dokumentasi Kegiatan",
    title: "Galeri Syiar & Ukhuwah SMAPA",
    lead: "Potret nyata aktivitas pembiasaan ibadah di Musholla Al-Ikhlas, kajian keputrian, dan kegiatan kepemimpinan SMA Negeri 4 Purwokerto.",
    items: [
      {
        id: "gal-1",
        title: "Kajian Akbar & Peringatan Isra Mi'raj Pelajar",
        category: "Kajian Akbar",
        date: "28 September 2026",
        image: "/images/dokumentasi-muskerta.jpg",
      },
      {
        id: "gal-2",
        title: "Tadarus Pagi & Pembiasaan Sholat Dhuha Berjamaah",
        category: "Ibadah Rutin",
        date: "05 Oktober 2026",
        image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "gal-3",
        title: "Mentoring Pekanan & Lingkaran Ukhuwah Sahabat Taat",
        category: "Mentoring Pelajar",
        date: "15 Oktober 2026",
        image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000&auto=format&fit=crop",
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
    btnSecondaryText: "Kotak Aspirasi Siswa",
    btnSecondaryLink: "/aspirasi",
  },
  sections: {
    showHero: true,
    showStats: true,
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
    sections: {
      showHero: raw.sections?.showHero !== false,
      showStats: raw.sections?.showStats !== false,
      showAbout: raw.sections?.showAbout !== false,
      showSambutan: raw.sections?.showSambutan !== false,
      showAgenda: raw.sections?.showAgenda !== false,
      showGallery: raw.sections?.showGallery !== false,
      showClosing: raw.sections?.showClosing !== false,
    },
  };
}
