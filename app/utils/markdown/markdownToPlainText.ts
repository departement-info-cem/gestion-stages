/**
 * Retire les marques Markdown pour ne garder que le texte. Sert à l'index de
 * recherche : une requête ne doit pas échouer parce qu'un mot était en gras.
 */
export function markdownToPlainText(source: string): string {
  return source
    .replace(/\r\n?/g, "\n")
    .replace(/^ {0,3}(?:`{3,}|~{3,}).*$/gm, " ")
    .replace(/!?\[([^\][]*)\]\([^()\s]*(?:\s+"[^"]*")?\)/g, "$1")
    .replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/g, "$1")
    .replace(/^ {0,3}#{1,6}\s+/gm, "")
    .replace(/^ {0,3}>[ \t]?/gm, "")
    .replace(/^ {0,3}(?:[-*_][ \t]*){3,}$/gm, " ")
    .replace(/^ *(?:[-*+]|\d{1,9}[.)])[ \t]+/gm, "")
    .replace(/\\([\\`*_{}[\]()#+\-.!~>|])/g, "$1")
    .replace(/[*~`]/g, "")
    // Un souligné collé à un mot appartient au texte (« nom_de_variable »).
    .replace(/(^|[^\p{L}\p{N}_])_{1,2}/gu, "$1")
    .replace(/_{1,2}($|[^\p{L}\p{N}_])/gu, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
