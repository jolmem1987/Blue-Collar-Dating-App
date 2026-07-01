"use client";
import { useState } from "react";
import Image from "next/image";

type Photo = { id: string; imageUrl: string; isPrimary: boolean; moderationStatus: string };

export function PhotoUploader({ initial }: { initial: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      let imageUrl: string;
      if (cloud && preset) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", preset);
        const up = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
          method: "POST",
          body: fd,
        });
        const data = await up.json();
        if (!data.secure_url) throw new Error("Upload failed.");
        imageUrl = data.secure_url;
      } else {
        // Dev fallback: data URL so the flow works without Cloudinary configured
        imageUrl = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(file);
        });
      }
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Could not save photo.");
      setPhotos((p) => [...p, d.photo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/photos?id=${id}`, { method: "DELETE" });
    setPhotos((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p) => (
          <div key={p.id} className="relative aspect-[3/4] overflow-hidden rounded-plate border border-steel-700 bg-steel-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
            {p.isPrimary && (
              <span className="absolute left-1 top-1 rounded bg-orange px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Main
              </span>
            )}
            {p.moderationStatus === "PENDING" && (
              <span className="absolute bottom-1 left-1 rounded bg-amber/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink">
                In review
              </span>
            )}
            <button
              onClick={() => remove(p.id)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded bg-black/70 text-bone hover:bg-red-600"
              aria-label="Remove photo"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < 6 && (
          <label className="grid aspect-[3/4] cursor-pointer place-items-center rounded-plate border border-dashed border-steel-600 bg-steel-900 text-steel-500 hover:border-orange hover:text-orange">
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
            <span className="text-3xl">{uploading ? "…" : "+"}</span>
          </label>
        )}
      </div>
      {!cloud && (
        <p className="mt-2 text-xs text-steel-500">
          Cloudinary not configured — photos are stored inline for local testing. Set
          NEXT_PUBLIC_CLOUDINARY_* in .env for real uploads.
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
