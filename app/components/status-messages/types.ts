export type StatusMessageType = "info" | "success" | "error";

/** Message d'avancement ou d'erreur affiché sous une étape de l'assistant */
export interface StatusMessage {
  id: number;
  type: StatusMessageType;
  text: string;
}
