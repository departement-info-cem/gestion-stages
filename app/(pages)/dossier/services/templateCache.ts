type TemplateCacheEntry = {
  kind: "binary" | "text";
  value: ArrayBuffer | string;
};

class TemplateCache {
  private cache = new Map<string, TemplateCacheEntry>();

  async getBinary(path: string): Promise<ArrayBuffer> {
    const cached = this.cache.get(path);
    if (cached?.kind === "binary" && cached.value instanceof ArrayBuffer) {
      return cached.value;
    }

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(
        `Le fichier de gabarit ${path} est introuvable. Ajoutez-le dans public${path}.`
      );
    }

    const buffer = await response.arrayBuffer();
    this.cache.set(path, { kind: "binary", value: buffer });
    return buffer;
  }

  async getText(path: string): Promise<string> {
    const cached = this.cache.get(path);
    if (cached?.kind === "text" && typeof cached.value === "string") {
      return cached.value;
    }

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(
        `Le fichier de gabarit ${path} est introuvable. Ajoutez-le dans public${path}.`
      );
    }

    const content = await response.text();
    this.cache.set(path, { kind: "text", value: content });
    return content;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const templateCache = new TemplateCache();
