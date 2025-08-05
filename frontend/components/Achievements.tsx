"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Achievement } from "@/lib/types";
import { useAdmin } from "./AdminGate";

interface AchForm {
  title: string;
  issuer: string;
  year: string;
}

const EMPTY: AchForm = { title: "", issuer: "", year: "" };

export default function Achievements({ initialData }: { initialData?: Achievement[] }) {
  const [achievements, setAchievements] = useState<Achievement[] | null>(initialData ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AchForm>(EMPTY);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<AchForm>(EMPTY);
  const [saving, setSaving] = useState(false);

  const { passphrase, isAdmin } = useAdmin();

  async function fetchAchievements() {
    const res = await fetch("/api/data/achievements");
    if (!res.ok) return;
    const data: Achievement[] = await res.json();
    setAchievements(data);
  }

  useEffect(() => { fetchAchievements(); }, []);

  async function handleDelete(id: string) {
    if (!passphrase || !confirm("delete?")) return;
    await fetch(`/api/data/achievements/${id}`, {
      method: "DELETE",
      headers: { "x-admin-passphrase": passphrase },
    });
    fetchAchievements();
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!passphrase || !editingId) return;
    setSaving(true);
    await fetch(`/api/data/achievements/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
      body: JSON.stringify({ ...editForm, year: Number(editForm.year) }),
    });
    setSaving(false);
    setEditingId(null);
    fetchAchievements();
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!passphrase) return;
    setSaving(true);
    await fetch("/api/data/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
      body: JSON.stringify({ ...newForm, year: Number(newForm.year) }),
    });
    setSaving(false);
    setAddingNew(false);
    setNewForm(EMPTY);
    fetchAchievements();
  }

  if (!achievements) return <div className="mb-8 text-xs text-gray-400">loading...</div>;

  return (
    <div className="mb-8">
      <ul className="space-y-1">
        {achievements.map(ach => (
          <li key={ach.id}>
            {editingId === ach.id ? (
              <form onSubmit={handleEdit} className="flex gap-2 items-center py-0.5 flex-wrap">
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[120px] outline-none bg-base focus:border-gray-500"
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="title"
                  required
                />
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
                  value={editForm.issuer}
                  onChange={e => setEditForm(f => ({ ...f, issuer: e.target.value }))}
                  placeholder="issuer"
                />
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs w-16 outline-none bg-base focus:border-gray-500"
                  value={editForm.year}
                  onChange={e => setEditForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="year"
                  type="number"
                />
                <button type="submit" disabled={saving} className="text-xs text-black hover:opacity-70 disabled:opacity-40">
                  {saving ? "..." : "save"}
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:text-black">
                  cancel
                </button>
              </form>
            ) : (
              <div className="flex items-baseline justify-between gap-4 text-sm group">
                <span className="text-black">
                  {ach.title}
                  <span className="text-gray-500 ml-2">— {ach.issuer}</span>
                </span>
                <div className="flex items-baseline gap-3 shrink-0">
                  <span className="text-xs text-gray-400">{ach.year}</span>
                  {isAdmin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(ach.id); setEditForm({ title: ach.title, issuer: ach.issuer, year: String(ach.year) }); }}
                        className="text-xs text-gray-400 hover:text-black"
                      >
                        edit
                      </button>
                      <button onClick={() => handleDelete(ach.id)} className="text-xs text-red-400 hover:text-red-700">
                        delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {isAdmin && !addingNew && (
        <button onClick={() => setAddingNew(true)} className="mt-2 text-xs text-gray-400 hover:text-black">
          + add
        </button>
      )}

      {addingNew && (
        <form onSubmit={handleAdd} className="mt-2 flex gap-2 items-center flex-wrap">
          <input
            className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[120px] outline-none bg-base focus:border-gray-500"
            value={newForm.title}
            onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
            placeholder="title"
            required
          />
          <input
            className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
            value={newForm.issuer}
            onChange={e => setNewForm(f => ({ ...f, issuer: e.target.value }))}
            placeholder="issuer"
          />
          <input
            className="border border-gray-300 px-1.5 py-0.5 text-xs w-16 outline-none bg-base focus:border-gray-500"
            value={newForm.year}
            onChange={e => setNewForm(f => ({ ...f, year: e.target.value }))}
            placeholder="year"
            type="number"
          />
          <button type="submit" disabled={saving} className="text-xs text-black hover:opacity-70 disabled:opacity-40">
            {saving ? "..." : "add"}
          </button>
          <button type="button" onClick={() => setAddingNew(false)} className="text-xs text-gray-400 hover:text-black">
            cancel
          </button>
        </form>
      )}
    </div>
  );
}
