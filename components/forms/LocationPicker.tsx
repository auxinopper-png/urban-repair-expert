"use client";

import { useState } from "react";
import { MapPin, LocateFixed, Loader2, CheckCircle2 } from "lucide-react";
import { cn, mapsLink } from "@/lib/utils";

export interface LocationValue {
  address: string;
  lat: number | null;
  lng: number | null;
}

export default function LocationPicker({
  value,
  onChange,
  error,
}: {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  error?: boolean;
}) {
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  function useGps() {
    setGpsError(null);
    if (!("geolocation" in navigator)) {
      setGpsError("Location not supported on this device. Please type your address.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onChange({ ...value, lat: +pos.coords.latitude.toFixed(6), lng: +pos.coords.longitude.toFixed(6) });
      },
      () => {
        setLocating(false);
        setGpsError("Couldn't access location. No problem — type your address below.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between gap-3">
          <label className="label-text">Complete Address *</label>
          <button
            type="button"
            onClick={useGps}
            disabled={locating}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100 disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LocateFixed className="h-3.5 w-3.5" />
            )}
            Use My Current Location
          </button>
        </div>
        <textarea
          rows={3}
          required
          className={cn(
            "field mt-1 resize-none",
            error && "!border-rose-400 focus:!border-rose-400 focus:!ring-rose-500/10"
          )}
          placeholder="Flat / House no., Building, Street, Landmark, Area, City, Pincode"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </div>

      {gpsError ? (
        <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">{gpsError}</p>
      ) : null}

      {value.lat != null && value.lng != null ? (
        <a
          href={mapsLink(value.lat, value.lng)}
          target="_blank"
          rel="noopener"
          className={cn(
            "flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          )}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span className="flex-1">
            GPS pinned · {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
            <span className="block text-xs font-normal text-emerald-600">Tap to preview on map</span>
          </span>
          <MapPin className="h-4 w-4 shrink-0" />
        </a>
      ) : null}
    </div>
  );
}
