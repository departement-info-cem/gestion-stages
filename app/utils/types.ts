/** Types partagés par les utilitaires généraux */

/** Contenu tabulaire d'une feuille : en-têtes normalisés et lignes de données */
export interface SheetTable {
  /** Libellés de la première ligne, débarrassés des espaces superflus */
  headers: string[];
  /** Lignes de données, alignées sur `headers` et converties en texte */
  rows: string[][];
}
