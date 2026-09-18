/** Réglages du rendu Markdown */
export interface MarkdownOptions {
  /**
   * Niveau du titre HTML qui précède déjà le texte rendu. Un « # » Markdown
   * produit le niveau suivant, pour ne pas casser la hiérarchie de la page
   * hôte (un « # » sous un `<h3>` devient un `<h4>`).
   */
  headingBaseLevel?: number;
}

export type ResolvedMarkdownOptions = Required<MarkdownOptions>;

/** Amorce d'un item de liste, une fois sa puce analysée */
export interface ListItemMarker {
  /** Nombre d'espaces devant la puce */
  indent: number;
  ordered: boolean;
  /** Numéro de départ d'une liste ordonnée, 1 sinon */
  start: number;
  /** Colonne où commence le texte : sert à désindenter les lignes suivantes */
  contentIndent: number;
  /** Texte de l'item, puce retirée */
  content: string;
}
