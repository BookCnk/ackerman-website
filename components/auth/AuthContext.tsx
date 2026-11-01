"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "CUSTOMER" | "ADMIN";
  erpCustomerId?: string;
  licensePlates: string[];
};

type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  register: (data: {
    name: string;
    phone: string;
    email?: string;
    licensePlate?: string;
  }) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: AuthUser = {
  id: "usr-ack-001",
  name: "ธนภัทร อัครเดช",
  phone: "089-456-7890",
  email: "thanapat@ackermanngarage.com",
  role: "CUSTOMER",
  erpCustomerId: "ERP-CUST-2026-088",
  licensePlates: ["3ขฬ 9911 กรุงเทพมหานคร"],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ackermann_user_session");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  const loginWithPhone = async (phone: string, _otp: string) => {
    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, "");
    const loggedUser: AuthUser = {
      ...DEMO_USER,
      phone: cleanPhone || DEMO_USER.phone,
    };
    setUser(loggedUser);
    localStorage.setItem("ackermann_user_session", JSON.stringify(loggedUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithEmail = async (email: string, _pass: string) => {
    const loggedUser: AuthUser = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
    };
    setUser(loggedUser);
    localStorage.setItem("ackermann_user_session", JSON.stringify(loggedUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const register = async (data: {
    name: string;
    phone: string;
    email?: string;
    licensePlate?: string;
  }) => {
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: "CUSTOMER",
      erpCustomerId: `ERP-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      licensePlates: data.licensePlate ? [data.licensePlate] : [],
    };
    setUser(newUser);
    localStorage.setItem("ackermann_user_session", JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ackermann_user_session");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        loginWithPhone,
        loginWithEmail,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

