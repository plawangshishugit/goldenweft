"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Group = "seasonal" | "style";

type Tile = {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  order: number;
};

const EMPTY: Omit<Tile, "id" | "key"> = {
  title: "",
  subtitle: "",
  href: "",
  image: "",
  order: 0,
};

const GROUPS: { value: Group; label: string; sectionLabel: string }[] = [
  { value: "seasonal", label: "Seasonal Highlights", sectionLabel: "homepage \u2192 Seasonal Highlights" },
  { value: "style", label: "Shop by Style", sectionLabel: "homepage \u2192 Shop by Style" },
];

export default function HomepageSectionsAdmin() {
  const [group, setGroup] = useState<Group>("seasonal");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Tile | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgErr, setMsgErr] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load(g: Group) {
    setLoading(true);
    const res = await fetch(`/api/admin/homepage-sections?group=${g}`);
    setTiles(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load(group);
  }, [group]);

  function flash(text: string, err = false) {
    setMsg(text);
    setMsgErr(err);
    setTimeout(() => setMsg(""), 3000);
  }

  function openNew() {
    setEditing({ ...EMPTY, id: "", key: "", order: tiles.length });
    setIsNew(true);
  }
  function openEdit(t: Tile) {
    setEditing({ ...t });
    setIsNew(false);
  }
  function closeForm() {
    setEditing(null);
  }

  function set<K extends keyof Tile>(field: K, val: Tile[K]) {
    setEditing((prev) => (prev ? { ...prev, [field]: val } : prev));
  }

  async function uploadImage(file: File) {
    if (!editing) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const data = await fetch("/api/admin/upload", { method: "POST", body: fd }).then((r) =>
      r.json()
    );
    setUploading(false);
    if (data.url) {
      set("image", data.url);
      flash("Image uploaded ✓");
    } else {
      flash(data.error ?? "Upload failed", true);
    }
  }

  async function save() {
    if (!editing || !editing.image || !editing.title) return;
    setSaving(true);
    const url = isNew ? "/api/admin/homepage-sections" : `/api/admin/homepage-sections/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editing, group }),
    });
    setSaving(false);
    if (res.ok) {
      flash(isNew ? "Tile added!" : "Saved!");
      await load(group);
      closeForm();
    } else {
      flash("Save failed.", true);
    }
  }

  async function del(t: Tile) {
    if (!confirm(`Delete "${t.title}"?`)) return;
    await fetch(`/api/admin/homepage-sections/${t.id}`, { method: "DELETE" });
    await load(group);
  }

  const activeGroup = GROUPS.find((g) => g.value === group)!;

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/admin" className="text-sm underline opacity-60 hover:opacity-100">
            ← Dashboard
          </a>
          <h1 className="text-lg font-medium">Homepage Sections</h1>
        </div>
        <button
          onClick={openNew}
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-black/80"
        >
          + Add Tile
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Group selector */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium opacity-60">Section:</label>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <button
                key={g.value}
                onClick={() => setGroup(g.value)}
                className={`text-sm px-3 py-1.5 rounded border transition ${
                  group === g.value
                    ? "bg-black text-white border-black"
                    : "border-black/20 hover:border-black/50"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {msg && (
          <div
            className={`mb-4 text-sm px-4 py-3 rounded ${
              msgErr ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {msg}
          </div>
        )}

        <p className="text-sm text-black/40 mb-5">
          Editing <span className="font-medium text-black/60">{activeGroup.sectionLabel}</span>.
          These tiles control the image, headline, small label, and link for each panel on the
          homepage. Changes go live as soon as you save.
        </p>

        {/* Tile grid */}
        {loading ? (
          <p className="text-sm opacity-50">Loading…</p>
        ) : tiles.length === 0 ? (
          <p className="text-sm opacity-50">
            No tiles yet for this section. Click "+ Add Tile" to create the first one.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tiles.map((t) => (
              <div
                key={t.id}
                className="border border-black/10 rounded overflow-hidden group relative"
              >
                <div className="relative w-full aspect-[3/4] bg-black/5">
                  {t.image ? (
                    <Image src={t.image} alt={t.title} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-black/30">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[0.65rem] uppercase tracking-wide opacity-50">{t.subtitle}</p>
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <p className="text-xs opacity-40 truncate">{t.href}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEdit(t)}
                    className="bg-white text-xs px-2 py-1 rounded shadow border border-black/10 hover:bg-black/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(t)}
                    className="bg-white text-xs px-2 py-1 rounded shadow border border-black/10 hover:bg-red-50 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Slide-over form ─────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={closeForm} />
          <div className="w-full max-w-xl bg-white overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-medium">
                {isNew ? "Add Tile" : "Edit Tile"} — {activeGroup.label}
              </h2>
              <button onClick={closeForm} className="text-xl opacity-40 hover:opacity-100">
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Image upload + paste link */}
              <Field label="Image">
                <label
                  className="block border-2 border-dashed border-black/20 rounded p-6 text-center cursor-pointer hover:border-black/40 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f) uploadImage(f);
                  }}
                >
                  {uploading ? (
                    <p className="text-sm opacity-50">Uploading…</p>
                  ) : editing.image ? (
                    <div>
                      <div className="relative w-full h-32 overflow-hidden rounded mb-2">
                        <Image src={editing.image} alt="" fill className="object-cover" sizes="400px" />
                      </div>
                      <p className="text-xs opacity-40 truncate">{editing.image}</p>
                      <p className="text-xs opacity-30 mt-1">Click or drop to replace</p>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto mb-2 opacity-30"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <p className="text-sm opacity-50">Click to upload or drag & drop</p>
                      <p className="text-xs opacity-30 mt-1">JPG, PNG, WebP</p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImage(f);
                    }}
                  />
                </label>
                <input
                  className={`${inp} mt-2`}
                  type="url"
                  placeholder="Or paste a Cloudinary / image URL…"
                  value={editing.image}
                  onChange={(e) => set("image", e.target.value)}
                />
              </Field>

              {/* Subtitle (small label) */}
              <Field label="Small label (e.g. Festive, Eternal, Just In)">
                <input
                  className={inp}
                  type="text"
                  placeholder="Festive"
                  value={editing.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                />
              </Field>

              {/* Title */}
              <Field label="Title *">
                <input
                  className={inp}
                  type="text"
                  placeholder="Diwali Edit"
                  value={editing.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>

              {/* Link */}
              <Field label="Link (where this tile sends visitors) *">
                <input
                  className={inp}
                  type="text"
                  placeholder="/seasons/diwali"
                  value={editing.href}
                  onChange={(e) => set("href", e.target.value)}
                />
              </Field>

              {/* Order */}
              <Field label="Display order (lower numbers appear first)">
                <input
                  className={inp}
                  type="number"
                  value={editing.order}
                  onChange={(e) => set("order", Number(e.target.value))}
                />
              </Field>

              {msg && (
                <p className={`text-sm ${msgErr ? "text-red-600" : "text-green-600"}`}>{msg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={save}
                  disabled={saving || !editing.image || !editing.title}
                  className="flex-1 bg-black text-white py-3 rounded text-sm disabled:opacity-40"
                >
                  {saving ? "Saving…" : isNew ? "Add Tile" : "Save Changes"}
                </button>
                <button onClick={closeForm} className="px-6 border border-black/20 rounded text-sm">
                  Cancel
                </button>
              </div>
              {(!editing.image || !editing.title) && (
                <p className="text-xs opacity-30 text-center">
                  Add an image and a title to save.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp =
  "w-full border border-black/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-black/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium opacity-60 mb-1">{label}</label>
      {children}
    </div>
  );
}
