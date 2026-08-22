"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary !py-2.5 !text-sm"
    >
      <Printer className="h-4 w-4" /> Print / Save PDF
    </button>
  );
}
