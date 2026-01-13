const ASSET_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function resolveAssetPath(relativePath: string): string {
  const normalized = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  if (!ASSET_BASE_PATH) return normalized;
  const base = ASSET_BASE_PATH.endsWith("/")
    ? ASSET_BASE_PATH.slice(0, -1)
    : ASSET_BASE_PATH;
  return `${base}${normalized}`;
}
