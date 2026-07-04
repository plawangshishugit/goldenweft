"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

/* ─── Types ─────────────────────────────────────── */
type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  fabric: string;
  weight: string;
  style: string;
  tier: string;
  tones: string[];
  occasions: string[];
  price: number;
  images: string[];
  isNew: boolean;
  isFeatured: boolean;
  featuredOrder: number;
  isActive: boolean;
  stock: number;
};

const EMPTY: Omit<Product, "id"> = {
  slug: "", name: "", description: "",
  fabric: "Tussar", weight: "Medium", style: "Traditional", tier: "Occasion",
  tones: [], occasions: [], price: 0, images: [], isNew: false, isFeatured: false, featuredOrder: 0, isActive: true, stock: 0,
};

const FABRICS  = ["Tussar", "Ghicha", "Mulberry"];
const WEIGHTS  = ["Light", "Medium", "Heavy"];
const STYLES   = ["Traditional", "Contemporary", "Elegant"];
const TIERS    = ["Everyday", "Occasion", "Heirloom"];
const ALL_TONES = ["Warm", "Cool", "Neutral", "Deep", "Soft", "Earthy", "Gold", "Bronze", "Red", "Green", "Blue", "Black", "Indigo"];
const ALL_OCC  = ["Wedding", "Festival", "Everyday", "Office", "Evening", "Reception", "Gift"];

/* ─── Main Page ─────────────────────────────────── */
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<Product | null>(null);
  const [isNew,   setIsNew]     = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [msg,     setMsg]       = useState("");
  const [search,  setSearch]    = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* fetch */
  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  /* open form */
  function openNew() {
    setEditing({ ...EMPTY, id: "" });
    setIsNew(true);
    setMsg("");
  }
  function openEdit(p: Product) {
    setEditing({ ...p });
    setIsNew(false);
    setMsg("");
  }
  function closeForm() { setEditing(null); }

  /* field helpers */
  function set(field: keyof Product, value: unknown) {
    setEditing(prev => prev ? { ...prev, [field]: value } : prev);
  }
  function toggleArray(field: "tones" | "occasions", val: string) {
    if (!editing) return;
    const arr = editing[field] as string[];
    set(field, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  /* image upload */
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !editing) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    set("images", [...editing.images, ...urls]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(url: string) {
    if (!editing) return;
    set("images", editing.images.filter(u => u !== url));
  }

  /* save */
  async function save() {
    if (!editing) return;
    setSaving(true);
    setMsg("");
    try {
      const url  = isNew ? "/api/admin/products" : `/api/admin/products/${editing.id}`;
      const meth = isNew ? "POST" : "PUT";
      const res  = await fetch(url, {
        method: meth,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const err = await res.json();
        setMsg("Error: " + (err.error ?? "Save failed"));
      } else {
        setMsg(isNew ? "Product created!" : "Product updated!");
        await load();
        closeForm();
      }
    } catch {
      setMsg("Network error.");
    } finally {
      setSaving(false);
    }
  }

  /* delete */
  async function del(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    await load();
  }

  /* filtered list */
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  /* ─── Render ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/admin" className="text-sm underline opacity-60 hover:opacity-100">← Dashboard</a>
          <h1 className="text-lg font-medium">Products</h1>
        </div>
        <button
          onClick={openNew}
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-black/80"
        >
          + Add Product
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or slug…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border border-black/20 rounded px-3 py-2 text-sm mb-6"
        />

        {/* Table */}
        {loading ? (
          <p className="text-sm opacity-50">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm opacity-50">No products found. Click "+ Add Product" to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="py-2 pr-4 font-medium w-16">Image</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Fabric</th>
                  <th className="py-2 pr-4 font-medium">Price</th>
                  <th className="py-2 pr-4 font-medium">Stock</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                    <td className="py-3 pr-4">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-black/5 rounded flex items-center justify-center text-xs text-black/30">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs opacity-50">{p.slug}</div>
                    </td>
                    <td className="py-3 pr-4 opacity-70">{p.fabric} · {p.weight}</td>
                    <td className="py-3 pr-4">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4">
                      <span className={p.stock <= 0 ? "text-red-600 font-medium" : p.stock <= 5 ? "text-amber-600 font-medium" : "opacity-80"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                      {p.isNew && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">New</span>}
                      {p.isFeatured && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Featured</span>}
                    </td>
                    <td className="py-3">
                      <button onClick={() => openEdit(p)} className="text-xs underline mr-3 opacity-70 hover:opacity-100">Edit</button>
                      <button onClick={() => del(p)} className="text-xs underline opacity-40 hover:opacity-100 hover:text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Slide-over form ─────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div className="flex-1 bg-black/30" onClick={closeForm} />

          {/* panel */}
          <div className="w-full max-w-xl bg-white overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-medium">{isNew ? "Add Product" : "Edit Product"}</h2>
              <button onClick={closeForm} className="text-xl opacity-40 hover:opacity-100">✕</button>
            </div>

            <div className="px-6 py-6 space-y-5">

              {/* Name */}
              <Field label="Product Name *">
                <input className={inp} value={editing.name}
                  onChange={e => {
                    set("name", e.target.value);
                    if (isNew) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                  }}
                />
              </Field>

              {/* Slug */}
              <Field label="Slug * (URL key, auto-generated)">
                <input className={inp} value={editing.slug} onChange={e => set("slug", e.target.value)} />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea className={`${inp} h-24 resize-none`} value={editing.description ?? ""}
                  onChange={e => set("description", e.target.value)} />
              </Field>

              {/* Row: Fabric / Weight */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fabric *">
                  <select className={inp} value={editing.fabric} onChange={e => set("fabric", e.target.value)}>
                    {FABRICS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Weight *">
                  <select className={inp} value={editing.weight} onChange={e => set("weight", e.target.value)}>
                    {WEIGHTS.map(w => <option key={w}>{w}</option>)}
                  </select>
                </Field>
              </div>

              {/* Row: Style / Tier */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Style *">
                  <select className={inp} value={editing.style} onChange={e => set("style", e.target.value)}>
                    {STYLES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Tier *">
                  <select className={inp} value={editing.tier} onChange={e => set("tier", e.target.value)}>
                    {TIERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₹) *">
                  <input type="number" min={0} className={inp} value={editing.price}
                    onChange={e => set("price", Number(e.target.value))} />
                </Field>
                <Field label="Stock on hand *">
                  <input type="number" min={0} step={1} className={inp} value={editing.stock}
                    onChange={e => set("stock", Math.max(0, Math.floor(Number(e.target.value))))} />
                </Field>
              </div>

              {/* Tones */}
              <Field label="Tones">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ALL_TONES.map(t => (
                    <button key={t} type="button"
                      onClick={() => toggleArray("tones", t)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${editing.tones.includes(t) ? "bg-black text-white border-black" : "border-black/20 hover:border-black/40"}`}
                    >{t}</button>
                  ))}
                </div>
              </Field>

              {/* Occasions */}
              <Field label="Occasions">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ALL_OCC.map(o => (
                    <button key={o} type="button"
                      onClick={() => toggleArray("occasions", o)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${editing.occasions.includes(o) ? "bg-black text-white border-black" : "border-black/20 hover:border-black/40"}`}
                    >{o}</button>
                  ))}
                </div>
              </Field>

              {/* Images */}
              <Field label="Images">
                <div className="flex flex-wrap gap-3 mt-2">
                  {editing.images.map(url => (
                    <div key={url} className="relative group w-20 h-20">
                      <Image src={url} alt="" width={80} height={80} className="w-20 h-20 object-cover rounded border border-black/10" />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute top-0.5 right-0.5 bg-black text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >✕</button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-black/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-black/40 text-xs text-black/40">
                    {uploading ? "…" : <>
                      <span className="text-2xl leading-none">+</span>
                      <span>Upload</span>
                    </>}
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
              </Field>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editing.isNew} onChange={e => set("isNew", e.target.checked)} />
                  Mark as New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editing.isFeatured} onChange={e => set("isFeatured", e.target.checked)} />
                  Show in Featured Silks
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editing.isActive} onChange={e => set("isActive", e.target.checked)} />
                  Active (visible on site)
                </label>
              </div>

              {editing.isFeatured && (
                <Field label="Featured position (lower numbers appear first on the homepage)">
                  <input
                    type="number"
                    className={`${inp} max-w-[140px]`}
                    value={editing.featuredOrder}
                    onChange={e => set("featuredOrder", Number(e.target.value))}
                  />
                </Field>
              )}

              {/* Error / success */}
              {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{msg}</p>}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving}
                  className="flex-1 bg-black text-white py-3 rounded text-sm disabled:opacity-50"
                >
                  {saving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
                </button>
                <button onClick={closeForm} className="px-6 border border-black/20 rounded text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────── */
const inp = "w-full border border-black/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-black/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium opacity-60 mb-1">{label}</label>
      {children}
    </div>
  );
}
