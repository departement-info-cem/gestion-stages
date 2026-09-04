const ASSET_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Préfixe un chemin d'asset public avec le basePath du déploiement
 * (ex. "/gestion-stages" sur GitHub Pages).
 */
export function resolveAssetPath(relativePath: string): string {
  const normalized = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  if (!ASSET_BASE_PATH) return normalized;
  const base = ASSET_BASE_PATH.startsWith("/")
    ? ASSET_BASE_PATH
    : `/${ASSET_BASE_PATH}`;
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalizedBase}${normalized}`;
}
