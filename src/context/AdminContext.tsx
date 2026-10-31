"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { EventItem } from "@/lib/types";
import { EVENTS_DATA } from "@/lib/constants";
import {
  StudentApplicant,
  StudentAspirasi,
  GalleryItem,
  BroadcastAnnouncement,
  INITIAL_APPLICANTS,
  INITIAL_ASPIRASI,
  INITIAL_GALLERY,
  INITIAL_ANNOUNCEMENT,
} from "@/lib/adminData";
import { HomeCmsData, DEFAULT_HOME_CMS, normalizeHomeCms } from "@/lib/homeCmsData";

interface ToastNotification {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
}

interface AdminContextType {
  // Events
  events: EventItem[];
  addEvent: (item: Omit<EventItem, "id" | "slug">) => void;
  updateEvent: (id: string, updated: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  toggleEventStatus: (id: string, status: EventItem["status"]) => void;

  // Applicants
  applicants: StudentApplicant[];
  updateApplicantStatus: (
    id: string,
    status: "pending" | "approved" | "rejected",
    notes?: string
  ) => void;
  deleteApplicant: (id: string) => void;

  // Aspirasi
  aspirasiList: StudentAspirasi[];
  replyAspirasi: (
    id: string,
    reply: string,
    status: "pending" | "in_review" | "resolved"
  ) => void;
  deleteAspirasi: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, "id">) => void;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  // Announcement
  announcement: BroadcastAnnouncement;
  updateAnnouncement: (updated: Partial<BroadcastAnnouncement>) => void;

  // Home CMS Data
  homeCms: HomeCmsData;
  updateHomeCms: (
    updated: Partial<HomeCmsData> | ((prev: HomeCmsData) => HomeCmsData)
  ) => void;
  resetHomeCms: () => void;

  // Global search & Toast
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const INITIAL_EVENTS: EventItem[] = (EVENTS_DATA as any[]).map((e, idx) => ({
  id: String(e.id || idx + 1),
  slug: (e.title || `event-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: e.title,
  category: (e.type || "Kajian") as any,
  date: e.date,
  time: e.time,
  location: e.location,
  speaker: e.speaker,
  quota: 150,
  registered: 45 + idx * 10,
  status: (e.status === "upcoming" ? "open" : (e.status || "open")) as any,
  image: e.image,
  description: e.description,
  isFeatured: idx === 0,
}));

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [applicants, setApplicants] = useState<StudentApplicant[]>(INITIAL_APPLICANTS);
  const [aspirasiList, setAspirasiList] = useState<StudentAspirasi[]>(INITIAL_ASPIRASI);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [announcement, setAnnouncement] = useState<BroadcastAnnouncement>(INITIAL_ANNOUNCEMENT);
  const [homeCms, setHomeCms] = useState<HomeCmsData>(DEFAULT_HOME_CMS);
  const [isInitialized, setIsInitialized] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Load from localStorage only after initial client mount to guarantee 100% SSR hydration match
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem("rohis_admin_events");
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedApplicants = localStorage.getItem("rohis_admin_applicants");
      if (savedApplicants) setApplicants(JSON.parse(savedApplicants));

      const savedAspirasi = localStorage.getItem("rohis_admin_aspirasi");
      if (savedAspirasi) setAspirasiList(JSON.parse(savedAspirasi));

      const savedGallery = localStorage.getItem("rohis_admin_gallery");
      if (savedGallery) setGallery(JSON.parse(savedGallery));

      const savedAnnouncement = localStorage.getItem("rohis_admin_announcement");
      if (savedAnnouncement) setAnnouncement(JSON.parse(savedAnnouncement));

      const savedCms = localStorage.getItem("rohis_home_cms");
      if (savedCms) setHomeCms(normalizeHomeCms(JSON.parse(savedCms)));
    } catch {}
    setIsInitialized(true);
  }, []);

  // Sync to local storage only after initial hydration load
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("rohis_admin_events", JSON.stringify(events));
    } catch {}
  }, [events, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("rohis_admin_applicants", JSON.stringify(applicants));
    } catch {}
  }, [applicants, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("rohis_admin_aspirasi", JSON.stringify(aspirasiList));
    } catch {}
  }, [aspirasiList, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("rohis_admin_gallery", JSON.stringify(gallery));
    } catch {}
  }, [gallery, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("rohis_admin_announcement", JSON.stringify(announcement));
    } catch {}
  }, [announcement, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("rohis_home_cms", JSON.stringify(homeCms));
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("rohis_cms_updated", { detail: homeCms })
        );
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("rohis_cms_channel");
          bc.postMessage(homeCms);
          bc.close();
        }
      }
    } catch {}
  }, [homeCms, isInitialized]);

  const updateHomeCms = (
    updated: Partial<HomeCmsData> | ((prev: HomeCmsData) => HomeCmsData)
  ) => {
    if (typeof updated === "function") {
      setHomeCms(updated);
    } else {
      setHomeCms((prev) => ({ ...prev, ...updated }));
    }
    showToast("Konten Beranda berhasil disimpan & disinkronkan!", "success");
  };

  const resetHomeCms = () => {
    setHomeCms(DEFAULT_HOME_CMS);
    try {
      localStorage.removeItem("rohis_home_cms");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("rohis_cms_updated", { detail: DEFAULT_HOME_CMS })
        );
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("rohis_cms_channel");
          bc.postMessage(DEFAULT_HOME_CMS);
          bc.close();
        }
      }
    } catch {}
    showToast("Konten Beranda di-reset ke data default awal.", "info");
  };

  const showToast = (
    message: string,
    type: "success" | "info" | "warning" = "success"
  ) => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  // Event actions
  const addEvent = (item: Omit<EventItem, "id" | "slug">) => {
    const id = `EVT-${Date.now().toString().slice(-4)}`;
    const slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const newEvent: EventItem = { ...item, id, slug };
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`Agenda "${item.title}" berhasil ditambahkan!`, "success");
  };

  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
    showToast("Data agenda berhasil diperbarui.", "success");
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast("Agenda telah dihapus dari sistem.", "warning");
  };

  const toggleEventStatus = (id: string, status: EventItem["status"]) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    showToast(`Status agenda diubah menjadi ${status}.`, "info");
  };

  // Applicant actions
  const updateApplicantStatus = (
    id: string,
    status: "pending" | "approved" | "rejected",
    notes?: string
  ) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              adminNotes: notes ?? a.adminNotes,
            }
          : a
      )
    );
    const statusLabel =
      status === "approved"
        ? "Diterima / Disetujui"
        : status === "rejected"
        ? "Ditolak"
        : "Menunggu";
    showToast(`Status calon anggota diperbarui: ${statusLabel}`, "success");
  };

  const deleteApplicant = (id: string) => {
    setApplicants((prev) => prev.filter((a) => a.id !== id));
    showToast("Data pendaftar telah dihapus.", "warning");
  };

  // Aspirasi actions
  const replyAspirasi = (
    id: string,
    reply: string,
    status: "pending" | "in_review" | "resolved"
  ) => {
    const repliedAt = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setAspirasiList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              adminReply: reply,
              status,
              repliedAt,
            }
          : item
      )
    );
    showToast("Tanggapan aspirasi berhasil disimpan!", "success");
  };

  const deleteAspirasi = (id: string) => {
    setAspirasiList((prev) => prev.filter((a) => a.id !== id));
    showToast("Aspirasi telah dihapus dari arsip.", "warning");
  };

  // Gallery actions
  const addGalleryItem = (item: Omit<GalleryItem, "id">) => {
    const id = `GAL-${Date.now().toString().slice(-4)}`;
    setGallery((prev) => [{ ...item, id }, ...prev]);
    showToast("Foto dokumentasi berhasil ditambahkan!", "success");
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
    showToast("Foto dokumentasi berhasil diperbarui!", "success");
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    showToast("Foto dokumentasi telah dihapus.", "warning");
  };

  // Announcement actions
  const updateAnnouncement = (updated: Partial<BroadcastAnnouncement>) => {
    setAnnouncement((prev) => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));
    showToast("Pengumuman broadcast berhasil diperbarui!", "success");
  };

  return (
    <AdminContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventStatus,
        applicants,
        updateApplicantStatus,
        deleteApplicant,
        aspirasiList,
        replyAspirasi,
        deleteAspirasi,
        gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        announcement,
        updateAnnouncement,
        homeCms,
        updateHomeCms,
        resetHomeCms,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
