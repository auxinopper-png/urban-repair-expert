"use client";

import Image from "next/image";
import { useRef } from "react";
import { Camera, Trash2, Video } from "lucide-react";

export interface SlotDef {
  key: string;
  label: string;
  required?: boolean;
  video?: boolean;
}

export interface PhotoSlot {
  file: File | null;
  preview: string | null;
}

const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 50;

export default function PhotoSlots({
  slots,
  value,
  onChange,
}: {
  slots: SlotDef[];
  value: Record<string, PhotoSlot>;
  onChange: (key: string, slot: PhotoSlot) => void;
}) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function pick(key: string, file: File | undefined | null) {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const maxMB = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
    if (file.size > maxMB * 1024 * 1024) {
      window.alert(`File too large — max ${maxMB} MB for ${isVideo ? "videos" : "photos"}.`);
      if (inputRefs.current[key]) inputRefs.current[key]!.value = "";
      return;
    }
    onChange(key, { file, preview: URL.createObjectURL(file) });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {slots.map((slot) => {
          const cur = value[slot.key] ?? { file: null, preview: null };
          return (
            <div key={slot.key}>
              <input
                ref={(el) => {
                  inputRefs.current[slot.key] = el;
                }}
                type="file"
                accept={slot.video ? "video/*" : "image/*"}
                className="hidden"
                onChange={(e) => pick(slot.key, e.target.files?.[0])}
              />
              {cur.preview ? (
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {slot.video ? (
                    <video src={cur.preview} className="h-full w-full object-cover" muted />
                  ) : (
                    <Image
                      src={cur.preview}
                      alt={slot.label}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (inputRefs.current[slot.key]) inputRefs.current[slot.key]!.value = "";
                      onChange(slot.key, { file: null, preview: null });
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow"
                    aria-label={`Remove ${slot.label}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-0 inset-x-0 bg-black/55 py-1 text-center text-[11px] font-bold text-white">
                    {slot.label}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRefs.current[slot.key]?.click()}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 text-slate-400 transition hover:border-brand-400 hover:text-brand-600"
                >
                  {slot.video ? <Video className="h-7 w-7" /> : <Camera className="h-7 w-7" />}
                  <span className="px-1 text-center text-[11px] font-bold leading-tight">
                    {slot.label}
                    {!slot.required ? <span className="block font-normal">(optional)</span> : null}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
        Pick from camera or gallery — after sending the details on WhatsApp, attach these photos
        &amp; video directly in the same chat. Nothing is uploaded to our servers.
      </p>
    </div>
  );
}
