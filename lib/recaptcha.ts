declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (key: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export async function getRecaptchaToken(action = "submit"): Promise<string | undefined> {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key || typeof window === "undefined" || !window.grecaptcha) return undefined;
  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!.execute(key, { action }).then(resolve).catch(() => resolve(undefined));
    });
  });
}
