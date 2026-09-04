export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  id?: string;
  value: string;
  options: readonly ComboboxOption[];
  /** Texte affiché lorsque aucune valeur n'est sélectionnée */
  placeholder: string;
  /** Libellé de l'option qui remet la sélection à vide */
  emptyOptionLabel?: string;
  searchPlaceholder?: string;
  noResultLabel?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}
