"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Project } from "@/lib/types";
import { useAdmin } from "./AdminGate";

interface ProjForm {
  title: string;
  description: string;
  link: string;
}

const EMPTY: ProjForm = { title: "", description: "", link: "" };

export default function Projects({ initialData }: { initialData?: Project[] }) {
  const [projects, setProjects] = useState<Project[] | null>(initialData ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProjForm>(EMPTY);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<ProjForm>(EMPTY);
  const [saving, setSaving] = useState(false);

  const { passphrase, isAdmin } = useAdmin();

  async function fetchProjects() {
    const res = await fetch("/api/data/projects");
    if (!res.ok) return;
    const data: Project[] = await res.json();
    setProjects(data);
  }

  useEffect(() => { fetchProjects(); }, []);

  async function handleDelete(id: string) {
    if (!passphrase || !confirm("delete?")) return;
    await fetch(`/api/data/projects/${id}`, {
      method: "DELETE",
      headers: { "x-admin-passphrase": passphrase },
    });
    fetchProjects();
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!passphrase || !editingId) return;
    setSaving(true);
    await fetch(`/api/data/projects/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    setEditingId(null);
    fetchProjects();
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!passphrase) return;
    setSaving(true);
    await fetch("/api/data/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
      body: JSON.stringify(newForm),
    });
    setSaving(false);
    setAddingNew(false);
    setNewForm(EMPTY);
    fetchProjects();
  }

  if (!projects) return <div className="mb-8 text-xs text-gray-400">loading...</div>;

  return (
    <div className="mb-8">
      <ul className="space-y-1">
        {projects.map(proj => (
          <li key={proj.id}>
            {editingId === proj.id ? (
              <form onSubmit={handleEdit} className="flex gap-2 items-center py-0.5 flex-wrap">
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="title"
                  required
                />
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="description"
                />
                <input
                  className="border border-gray-300 px-1.5 py-0.5 text-xs w-40 outline-none bg-base focus:border-gray-500"
                  value={editForm.link}
                  onChange={e => setEditForm(f => ({ ...f, link: e.target.value }))}
                  placeholder="url"
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
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  ↗ {proj.title}
                  <span className="text-gray-500 ml-2 no-underline">— {proj.description}</span>
                </a>
                {isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => { setEditingId(proj.id); setEditForm({ title: proj.title, description: proj.description, link: proj.link }); }}
                      className="text-xs text-gray-400 hover:text-black"
                    >
                      edit
                    </button>
                    <button onClick={() => handleDelete(proj.id)} className="text-xs text-red-400 hover:text-red-700">
                      delete
                    </button>
                  </div>
                )}
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
            value={newForm.title}
            onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
            placeholder="title"
            required
          />
          <input
            className="border border-gray-300 px-1.5 py-0.5 text-xs flex-1 min-w-[100px] outline-none bg-base focus:border-gray-500"
            value={newForm.description}
            onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
            placeholder="description"
          />
          <input
            className="border border-gray-300 px-1.5 py-0.5 text-xs w-40 outline-none bg-base focus:border-gray-500"
            value={newForm.link}
            onChange={e => setNewForm(f => ({ ...f, link: e.target.value }))}
            placeholder="url"
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
