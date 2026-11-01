"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CATALOG_ITEMS,
  CatalogItem,
  ErpBookingRecord,
  INITIAL_ERP_BOOKINGS,
  VEHICLES,
} from "@/lib/mock-erp-data";

type BookingContextValue = {
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  selectedItems: CatalogItem[];
  addItem: (item: CatalogItem, openDrawer?: boolean) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  loadBuildPreset: (vehicleId: string, partIds: string[]) => void;
  bookings: ErpBookingRecord[];
  addBookingRecord: (record: ErpBookingRecord) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  inspectedBuildId: string | null;
  setInspectedBuildId: (buildId: string | null) => void;
  introReplayCount: number;
  replayIntro: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

const STORAGE_KEY_VEHICLE = "ackermann_selected_vehicle_v1";
const STORAGE_KEY_ITEMS = "ackermann_selected_items_v1";
const STORAGE_KEY_BOOKINGS = "ackermann_erp_bookings_v1";

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicleId, setSelectedVehicleIdState] = useState<string>("ALL");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([
    "ohlins-rt-g20",
    "pkg-corner-alignment",
  ]);
  const [bookings, setBookings] = useState<ErpBookingRecord[]>(INITIAL_ERP_BOOKINGS);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [inspectedBuildId, setInspectedBuildId] = useState<string | null>(null);
  const [introReplayCount, setIntroReplayCount] = useState(0);

  useEffect(() => {
    try {
      const savedVehicle = localStorage.getItem(STORAGE_KEY_VEHICLE);
      if (savedVehicle) setSelectedVehicleIdState(savedVehicle);

      const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed)) setSelectedItemIds(parsed);
      }

      const savedBookings = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        if (Array.isArray(parsed) && parsed.length > 0) setBookings(parsed);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setSelectedVehicleId = (id: string) => {
    setSelectedVehicleIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLE, id);
    } catch {
      // Ignore
    }
  };

  const syncItemsToStorage = (ids: string[]) => {
    setSelectedItemIds(ids);
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(ids));
    } catch {
      // Ignore
    }
  };

  const addItem = (item: CatalogItem, openDrawer = true) => {
    if (!selectedItemIds.includes(item.id)) {
      syncItemsToStorage([...selectedItemIds, item.id]);
    }
    if (openDrawer) {
      setInspectedBuildId(null);
      setIsCartDrawerOpen(true);
    }
  };

  const removeItem = (id: string) => {
    syncItemsToStorage(selectedItemIds.filter((itemId) => itemId !== id));
  };

  const clearItems = () => {
    syncItemsToStorage([]);
  };

  const loadBuildPreset = (vehicleId: string, partIds: string[]) => {
    if (VEHICLES.some((v) => v.id === vehicleId)) {
      setSelectedVehicleId(vehicleId);
    }
    const validIds = partIds.filter((id) =>
      CATALOG_ITEMS.some((item) => item.id === id)
    );
    syncItemsToStorage(validIds);
  };

  const addBookingRecord = (record: ErpBookingRecord) => {
    const next = [record, ...bookings];
    setBookings(next);
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const replayIntro = () => {
    setIntroReplayCount((c) => c + 1);
  };

  const selectedItems = selectedItemIds
    .map((id) => CATALOG_ITEMS.find((item) => item.id === id))
    .filter((item): item is CatalogItem => Boolean(item));

  return (
    <BookingContext.Provider
      value={{
        selectedVehicleId,
        setSelectedVehicleId,
        selectedItems,
        addItem,
        removeItem,
        clearItems,
        loadBuildPreset,
        bookings,
        addBookingRecord,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        inspectedBuildId,
        setInspectedBuildId,
        introReplayCount,
        replayIntro,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return ctx;
}
