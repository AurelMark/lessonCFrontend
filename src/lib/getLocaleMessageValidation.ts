export function getLocaleMessage(
  message: unknown,
  locale: string
): string | null {
   if (
    typeof message === "object" &&
    message !== null &&
    "root" in message &&
    typeof (message as Record<string, unknown>).root === "object" &&
    (message as Record<string, unknown>).root !== null &&
    "message" in (message as { root: Record<string, unknown> }).root
  ) {
    const root = (message as { root: Record<string, unknown> }).root;
    return getLocaleMessage(
      (root as Record<string, unknown>).message,
      locale
    );
  }

  if (
    typeof message === "object" &&
    message !== null &&
    locale in (message as Record<string, unknown>)
  ) {
    const localizedMsg = (message as Record<string, unknown>)[locale];
    return typeof localizedMsg === "string" ? localizedMsg : null;
  }

  if (typeof message === "string") return message;

  return null;
}
