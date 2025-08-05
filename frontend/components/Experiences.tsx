"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Experience } from "@/lib/types";
import { useAdmin } from "./AdminGate";

interface ExpForm {
  company: string;
  title: string;
  dates: string;
}

const EMPTY: ExpForm = { company: "", title: "", dates: "" };

export default function Experiences({ initialData }: { initialData?: Experience[] }) {
  const [experiences, setExperiences] = useState<Experience[] | null>(initialData ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ExpForm>(EMPTY);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<ExpForm>(EMPTY);
  const [saving, setSaving] = useState(false);

  const { passphrase, isAdmin } = useAdmin();

  async function fetchExperiences() {
    const res = await fetch("/api/data/experiences");
    if (!res.ok) return;
    const data: Experience[] = await res.json();
    setExperiences(data);
  }

  useEffect(() => { fetchExperiences(); }, []);

  async function handleDelete(id: string) {
    if (!passphrase || !confirm("delete?")) return;
    await fetch(`/api/data/experiences/${id}`, {
      method: "DELETE",
      headers: { "x-admin-passphrase": passphrase },
    });
    fetchExperiences();
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!passphrase || !editingId) return;
    setSaving(true);
    await fetch(`/api/data/experiences/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    setEditingId(null);
    fetchExperiences();
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!passphrase) return;
    setSaving(true);
    await fetch("/api/data/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
      body: JSON.stringify(newForm),
    });
    setSaving(false);
    setAddingNew(false);
    setNewForm(EMPTY);
    fetchExperiences();
  }

  if (!experiences) return <div className="mb-8 text-xs text-gray-400">loading...</div>;

  return (
    <div className="mb-8">
      <ul className="space-y-1">
        {experiences.map(exp => (
          <li key={exp.id}>
            {editingId === exp.id ? (
              <form onSubmit={handleEdit} className="flex gap-2 items-center py-0.5 flex-wrap">
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
                  value={editForm.company}
                  onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="company"
                  required
                />
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="role"
                  required
                />
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs w-28 outline-none bg-base focus:border-gray-500"
                  value={editForm.dates}
                  onChange={e => setEditForm(f => ({ ...f, dates: e.target.value }))}
                  placeholder="dates"
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
                  {exp.company}
                  <span className="text-gray-500 ml-2">— {exp.title}</span>
                </span>
                <div className="flex items-baseline gap-3 shrink-0">
                  <span className="text-xs text-gray-400">{exp.dates}</span>
                  {isAdmin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(exp.id); setEditForm({ company: exp.company, title: exp.title, dates: exp.dates }); }}
                        className="text-xs text-gray-400 hover:text-black"
                      >
                        edit
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="text-xs text-red-400 hover:text-red-700">
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
            className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
            value={newForm.company}
            onChange={e => setNewForm(f => ({ ...f, company: e.target.value }))}
            placeholder="company"
            required
          />
          <input
            className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
            value={newForm.title}
            onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
            placeholder="role"
            required
          />
          <input
            className="border border-gray-300 px-1.5 py-0.5 text-xs w-28 outline-none bg-base focus:border-gray-500"
            value={newForm.dates}
            onChange={e => setNewForm(f => ({ ...f, dates: e.target.value }))}
            placeholder="dates"
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
