"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type MediaType = "image" | "video" | "gif";
type TextPos   = "bottom-center" | "bottom-left" | "center";

type HeroSlide = {
  id: string;
  key: string;
  page: string;
  type: MediaType;
  url: string;
  poster?: string;
  eyebrow?: string;
  headline: string;
  subline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaLabel2?: string;
  ctaHref2?: string;
  overlayOpacity: number;
  textPosition: TextPos;
  active: boolean;
  order: number;
};

const EMPTY: Omit<HeroSlide, "id" | "key"> = {
  page: "/",
  type: "video",
  url: "",
  poster: "",
  eyebrow: "",
  headline: "",
  subline: "",
  ctaLabel: "Explore Collections",
  ctaHref: "/collections",
  ctaLabel2: "",
  ctaHref2: "",
  overlayOpacity: 0.3,
  textPosition: "bottom-center",
  active: true,
  order: 0,
};

const PAGES = [
  { value: "/",           label: "Home Page  ( / )" },
  { value: "/collections",label: "Collections" },
  { value: "/seasons",    label: "Seasons" },
  { value: "/styles",     label: "Styles" },
  { value: "/legacy",     label: "Legacy" },
  { value: "/exports",    label: "Exports" },
  { value: "/about",      label: "About" },
];

export default function HeroSlidesAdmin() {
  const [selectedPage, setSelectedPage] = useState("/");
  const [slides, setSlides]   = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [isNew,   setIsNew]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [uploadingMedia,  setUploadingMedia]  = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [msg,    setMsg]    = useState("");
  const [msgErr, setMsgErr] = useState(false);
  const mediaRef  = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);

  async function load(page: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/hero-slides?page=${encodeURIComponent(page)}`);
    setSlides(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(selectedPage); }, [selectedPage]);

  function flash(text: string, err = false) {
    setMsg(text); setMsgErr(err);
    setTimeout(() => setMsg(""), 3000);
  }

  function openNew() {
    setEditing({ ...EMPTY, id: "", key: "", page: selectedPage });
    setIsNew(true);
  }
  function openEdit(s: HeroSlide) { setEditing({ ...s }); setIsNew(false); }
  function closeForm() { setEditing(null); }

  function set<K extends keyof HeroSlide>(field: K, val: HeroSlide[K]) {
    setEditing(prev => prev ? { ...prev, [field]: val } : prev);
  }

  async function uploadMedia(file: File) {
    if (!editing) return;
    setUploadingMedia(true);
    const isVid = file.type.startsWith("video/") || editing.type === "video";
    const isGif = file.type === "image/gif";
    const ep = (isVid && !isGif) ? "/api/admin/upload-video" : "/api/admin/upload";
    const fd = new FormData(); fd.append("file", file);
    const data = await fetch(ep, { method: "POST", body: fd }).then(r => r.json());
    setUploadingMedia(false);
    if (data.url) { set("url", data.url); flash("Uploaded ✓"); }
    else flash(data.error ?? "Upload failed", true);
  }

  async function uploadPoster(file: File) {
    if (!editing) return;
    setUploadingPoster(true);
    const fd = new FormData(); fd.append("file", file);
    const data = await fetch("/api/admin/upload", { method: "POST", body: fd }).then(r => r.json());
    setUploadingPoster(false);
    if (data.url) set("poster", data.url);
    else flash(data.error ?? "Poster upload failed", true);
  }

  async function save() {
    if (!editing || !editing.url) return;
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, key, ...body } = editing;
    const url  = isNew ? "/api/admin/hero-slides" : `/api/admin/hero-slides/${id}`;
    const meth = isNew ? "POST" : "PUT";
    const res  = await fetch(url, { method: meth, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) { flash(isNew ? "Slide added!" : "Saved!"); await load(selectedPage); closeForm(); }
    else flash("Save failed.", true);
  }

  async function del(s: HeroSlide) {
    if (!confirm(`Delete "${s.headline}"?`)) return;
    await fetch(`/api/admin/hero-slides/${s.id}`, { method: "DELETE" });
    await load(selectedPage);
  }

  /* ── render ── */
  return (
    <div className="min-h-screen bg-white">

      {/* Top bar */}
      <div className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/admin" className="text-sm underline opacity-60 hover:opacity-100">← Dashboard</a>
          <h1 className="text-lg font-medium">Hero Slides</h1>
        </div>
        <button onClick={openNew} className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-black/80">
          + Add Slide
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Page selector */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium opacity-60">Page:</label>
          <div className="flex flex-wrap gap-2">
            {PAGES.map(p => (
              <button
                key={p.value}
                onClick={() => setSelectedPage(p.value)}
                className={`text-sm px-3 py-1.5 rounded border transition ${selectedPage === p.value ? "bg-black text-white border-black" : "border-black/20 hover:border-black/50"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {msg && (
          <div className={`mb-4 text-sm px-4 py-3 rounded ${msgErr ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{msg}</div>
        )}

        <p className="text-sm text-black/40 mb-5">
          Managing hero slides for <strong>{PAGES.find(p => p.value === selectedPage)?.label}</strong>. The first active slide is shown. Multiple slides auto-rotate with Prada-style progress indicators.
        </p>

        {/* Table */}
        {loading ? (
          <p className="text-sm opacity-40">Loading…</p>
        ) : slides.length === 0 ? (
          <div className="border-2 border-dashed border-black/10 rounded-lg p-16 text-center">
            <p className="text-sm opacity-40 mb-4">No slides for this page yet.</p>
            <button onClick={openNew} className="text-sm underline opacity-60 hover:opacity-100">+ Add first slide</button>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-left">
                <th className="py-2 pr-4 font-medium w-24">Preview</th>
                <th className="py-2 pr-4 font-medium">Headline</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Text pos</th>
                <th className="py-2 pr-4 font-medium">Overlay</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map(s => (
                <tr key={s.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                  <td className="py-3 pr-4">
                    {s.type !== "video" && s.url ? (
                      <div className="relative w-20 h-14 overflow-hidden rounded bg-black/5">
                        <Image src={s.poster || s.url} alt="" fill className="object-cover" sizes="80px"/>
                      </div>
                    ) : s.poster ? (
                      <div className="relative w-20 h-14 overflow-hidden rounded bg-black/5">
                        <Image src={s.poster} alt="" fill className="object-cover" sizes="80px"/>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                            <svg width="8" height="8" fill="white" viewBox="0 0 10 10"><polygon points="3,2 8,5 3,8"/></svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-14 bg-black/5 rounded flex items-center justify-center text-xs opacity-30">
                        {s.type}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{s.headline}</div>
                    {s.eyebrow && <div className="text-xs opacity-40">{s.eyebrow}</div>}
                    {s.ctaLabel && <div className="text-xs opacity-30 mt-0.5">{s.ctaLabel}{s.ctaLabel2 ? ` · ${s.ctaLabel2}` : ""}</div>}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.type === "video" ? "bg-purple-50 text-purple-700" : s.type === "gif" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"}`}>
                      {s.type === "video" ? "🎬 Video" : s.type === "gif" ? "🎞 GIF" : "🖼 Image"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 opacity-50 text-xs">{s.textPosition ?? "bottom-center"}</td>
                  <td className="py-3 pr-4 opacity-60 text-xs">{Math.round((s.overlayOpacity ?? 0.3) * 100)}%</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {s.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => openEdit(s)} className="text-xs underline mr-3 opacity-70 hover:opacity-100">Edit</button>
                    <button onClick={() => del(s)} className="text-xs underline opacity-40 hover:text-red-600 hover:opacity-100">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Slide-over form ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={closeForm} />
          <div className="w-full max-w-xl bg-white overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-medium">{isNew ? "Add Slide" : "Edit Slide"} — {PAGES.find(p => p.value === selectedPage)?.label}</h2>
              <button onClick={closeForm} className="text-xl opacity-40 hover:opacity-100">✕</button>
            </div>

            <div className="px-6 py-6 space-y-5">

              {/* Media type */}
              <Field label="Media type">
                <div className="flex gap-2 mt-1">
                  {(["image", "video", "gif"] as MediaType[]).map(t => (
                    <button key={t} type="button" onClick={() => set("type", t)}
                      className={`flex-1 py-2 text-sm rounded border transition ${editing.type === t ? "bg-black text-white border-black" : "border-black/20 hover:border-black/50"}`}>
                      {t === "video" ? "🎬 Video" : t === "gif" ? "🎞 GIF" : "🖼 Image"}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Media upload */}
              <Field label={editing.type === "video" ? "Video file (MP4/MOV)" : editing.type === "gif" ? "GIF file" : "Image file"}>
                <label
                  className="block border-2 border-dashed border-black/20 rounded p-6 text-center cursor-pointer hover:border-black/40 transition"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadMedia(f); }}
                >
                  {uploadingMedia ? (
                    <p className="text-sm opacity-50">Uploading…</p>
                  ) : editing.url ? (
                    <div>
                      {editing.type === "image" && (
                        <div className="relative w-full h-28 overflow-hidden rounded mb-2">
                          <Image src={editing.url} alt="" fill className="object-cover" sizes="400px"/>
                        </div>
                      )}
                      {editing.type === "gif" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={editing.url} alt="" className="max-h-28 mx-auto mb-2 rounded"/>
                      )}
                      {editing.type === "video" && (
                        <p className="text-sm text-green-700 mb-1">✓ Video uploaded</p>
                      )}
                      <p className="text-xs opacity-40 truncate">{editing.url.split("/").pop()}</p>
                      <p className="text-xs opacity-30 mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto mb-2 opacity-30" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                      <p className="text-sm opacity-50">Click to upload or drag & drop</p>
                      <p className="text-xs opacity-30 mt-1">{editing.type === "video" ? "MP4, MOV, WebM" : editing.type === "gif" ? "GIF (animated)" : "JPG, PNG, WebP"}</p>
                    </>
                  )}
                  <input ref={mediaRef} type="file" className="hidden"
                    accept={editing.type === "video" ? "video/*" : editing.type === "gif" ? "image/gif" : "image/*"}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadMedia(f); }} />
                </label>
                <input className={`${inp} mt-2`} type="url"
                  placeholder="Or paste URL…"
                  value={editing.url} onChange={e => set("url", e.target.value)} />
              </Field>

              {/* Poster (video only) */}
              {editing.type === "video" && (
                <Field label="Poster image (shown while loading)">
                  <label className="inline-flex items-center gap-2 border border-black/20 rounded px-3 py-2 text-sm cursor-pointer hover:border-black/50 transition">
                    {uploadingPoster ? "Uploading…" : "Upload poster"}
                    <input ref={posterRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadPoster(f); }} />
                  </label>
                  {editing.poster && (
                    <div className="relative w-24 h-16 mt-2 overflow-hidden rounded border border-black/10">
                      <Image src={editing.poster} alt="" fill className="object-cover" sizes="96px"/>
                    </div>
                  )}
                  <input className={`${inp} mt-2`} type="url" placeholder="Or paste poster URL…"
                    value={editing.poster ?? ""} onChange={e => set("poster", e.target.value)} />
                </Field>
              )}

              {/* Overlay */}
              <Field label={`Overlay darkness — ${Math.round((editing.overlayOpacity) * 100)}%`}>
                <input type="range" min="0" max="0.85" step="0.05"
                  value={editing.overlayOpacity}
                  onChange={e => set("overlayOpacity", parseFloat(e.target.value))}
                  className="w-full mt-1" />
                <div className="flex justify-between text-xs opacity-30 mt-1"><span>0%</span><span>85%</span></div>
              </Field>

              {/* Text position */}
              <Field label="Text position">
                <div className="flex gap-2 mt-1">
                  {(["bottom-center","bottom-left","center"] as TextPos[]).map(p => (
                    <button key={p} type="button" onClick={() => set("textPosition", p)}
                      className={`flex-1 py-1.5 text-xs rounded border transition ${editing.textPosition === p ? "bg-black text-white border-black" : "border-black/20 hover:border-black/50"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Eyebrow */}
              <Field label="Eyebrow (small text above headline)">
                <input className={inp} type="text" placeholder="The Handloom Edit"
                  value={editing.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
              </Field>

              {/* Headline */}
              <Field label="Headline *">
                <input className={inp} type="text" placeholder="Woven in Bhagalpur"
                  value={editing.headline} onChange={e => set("headline", e.target.value)} />
              </Field>

              {/* Subline */}
              <Field label="Subline (optional body text)">
                <input className={inp} type="text" placeholder="Handwoven Tussar silk from the looms of Bhagalpur"
                  value={editing.subline ?? ""} onChange={e => set("subline", e.target.value)} />
              </Field>

              {/* CTA 1 */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="CTA 1 label">
                  <input className={inp} type="text" placeholder="Explore Collections"
                    value={editing.ctaLabel ?? ""} onChange={e => set("ctaLabel", e.target.value)} />
                </Field>
                <Field label="CTA 1 link">
                  <input className={inp} type="text" placeholder="/collections"
                    value={editing.ctaHref ?? ""} onChange={e => set("ctaHref", e.target.value)} />
                </Field>
              </div>

              {/* CTA 2 */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="CTA 2 label (optional)">
                  <input className={inp} type="text" placeholder="For Him"
                    value={editing.ctaLabel2 ?? ""} onChange={e => set("ctaLabel2", e.target.value)} />
                </Field>
                <Field label="CTA 2 link">
                  <input className={inp} type="text" placeholder="/collections/men"
                    value={editing.ctaHref2 ?? ""} onChange={e => set("ctaHref2", e.target.value)} />
                </Field>
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.active}
                  onChange={e => set("active", e.target.checked)} />
                Active (visible on site)
              </label>

              {msg && <p className={`text-sm ${msgErr ? "text-red-600" : "text-green-600"}`}>{msg}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving || !editing.url || !editing.headline}
                  className="flex-1 bg-black text-white py-3 rounded text-sm disabled:opacity-40">
                  {saving ? "Saving…" : isNew ? "Add Slide" : "Save Changes"}
                </button>
                <button onClick={closeForm} className="px-6 border border-black/20 rounded text-sm">Cancel</button>
              </div>
              {(!editing.url || !editing.headline) && (
                <p className="text-xs opacity-30 text-center">Upload media and add a headline to save.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full border border-black/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-black/50";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium opacity-60 mb-1">{label}</label>{children}</div>;
}