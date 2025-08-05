"use client";

import React, { useState, useEffect } from "react";

const SESSION_KEY = "admin_passphrase";

export function useAdmin() {
  const [passphrase, setPassphrase] = useState<string | null>(null);

  useEffect(() => {
    setPassphrase(sessionStorage.getItem(SESSION_KEY));
  }, []);

  const login = (p: string) => {
    sessionStorage.setItem(SESSION_KEY, p);
    setPassphrase(p);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setPassphrase(null);
  };

  return { passphrase, login, logout, isAdmin: !!passphrase };
}

interface AdminGateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (_p: string) => void;
}

export default function AdminGate({ open, onClose, onSuccess }: AdminGateProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    // Verify passphrase by making a test admin API call
    try {
      const res = await fetch("/api/blog", {
        headers: { "x-admin-passphrase": value },
      });
      if (res.ok) {
        onSuccess(value);
        onClose();
        setValue("");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        className="bg-base border border-gray-300 p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="text-sm font-medium mb-3">admin login</div>
        <input
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="passphrase"
          className="w-full border border-gray-300 bg-base px-3 py-2 text-sm outline-none focus:border-gray-500 mb-2"
          autoFocus
        />
        {error && (
          <div className="text-xs text-red-600 mb-2">incorrect passphrase</div>
        )}
        <div className="flex gap-2 justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-black px-3 py-1.5"
          >
            cancel
          </button>
          <button
            type="submit"
            disabled={loading || !value}
            className="text-xs bg-black text-white px-3 py-1.5 disabled:opacity-40"
          >
            {loading ? "..." : "login"}
          </button>
        </div>
      </form>
    </div>
  );
}
