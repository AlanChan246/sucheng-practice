/** Absolute app URL for GitHub Pages base path. */
export function appPath(to: string): string {
  const base = (import.meta.env?.BASE_URL ?? '/sucheng-practice/').replace(/\/$/, '')
  if (to === '/') return `${base}/`
  return `${base}${to.startsWith('/') ? to : `/${to}`}`
}

/**
 * Force a real document navigation.
 * After GitHub Pages deep-link boot, client-side route changes can update the
 * URL while leaving the previous screen mounted — hard navigation avoids that.
 */
export function hardNavigate(to: string) {
  window.location.assign(appPath(to))
}
