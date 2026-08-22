import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link href="/" className="btn-primary mt-8 !px-8">
        Back to Home
      </Link>
    </div>
  );
}
