"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./Combobox.module.css";
import type { ComboboxOption, ComboboxProps } from "./types";

export type { ComboboxOption, ComboboxProps };

const EMPTY_VALUE = "";

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function Combobox({
  id,
  value,
  options,
  placeholder,
  emptyOptionLabel,
  searchPlaceholder = "Rechercher une colonne…",
  noResultLabel = "Aucune correspondance",
  disabled = false,
  onChange,
}: ComboboxProps) {
  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const allOptions = useMemo<ComboboxOption[]>(() => {
    const base = [...options];
    if (emptyOptionLabel) {
      base.unshift({ value: EMPTY_VALUE, label: emptyOptionLabel });
    }
    return base;
  }, [emptyOptionLabel, options]);

  const visibleOptions = useMemo<ComboboxOption[]>(() => {
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return allOptions;
    return allOptions.filter(
      (option) =>
        option.value === EMPTY_VALUE ||
        normalize(option.label).includes(normalizedQuery)
    );
  }, [allOptions, query]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const close = useCallback((refocusTrigger = true) => {
    setIsOpen(false);
    setQuery("");
    if (refocusTrigger) {
      triggerRef.current?.focus();
    }
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    const selectedIndex = allOptions.findIndex(
      (option) => option.value === value
    );
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setQuery("");
    setIsOpen(true);
  }, [allOptions, disabled, value]);

  const selectOption = useCallback(
    (option: ComboboxOption | undefined) => {
      if (!option) return;
      onChange(option.value);
      close();
    },
    [close, onChange]
  );

  // Fermeture au clic à l'extérieur ou lorsque le focus quitte le composant
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !containerRef.current?.contains(target)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isOpen]);

  // Place le curseur dans le champ de recherche dès l'ouverture, sans
  // déplacer la page : le panneau est déjà sous le déclencheur cliqué.
  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  // Garde l'option surlignée visible sans jamais faire défiler la page
  useEffect(() => {
    if (!isOpen) return;
    const option = optionRefs.current.get(highlightedIndex);
    const list = listRef.current;
    if (!option || !list) return;

    const optionTop = option.offsetTop;
    const optionBottom = optionTop + option.offsetHeight;

    if (optionTop < list.scrollTop) {
      list.scrollTop = optionTop;
    } else if (optionBottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = optionBottom - list.clientHeight;
    }
  }, [highlightedIndex, isOpen]);

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((previous) =>
          Math.min(previous + 1, visibleOptions.length - 1)
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((previous) => Math.max(previous - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setHighlightedIndex(visibleOptions.length - 1);
        break;
      case "Enter":
        event.preventDefault();
        selectOption(visibleOptions[highlightedIndex]);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        break;
    }
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
    }
  };

  return (
    <div className={styles.combobox} ref={containerRef}>
      <button
        id={id}
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className={
            selectedOption ? styles.triggerValue : styles.triggerPlaceholder
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span className={styles.caret} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <input
            ref={searchRef}
            type="text"
            className={styles.search}
            value={query}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-controls={listboxId}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleSearchKeyDown}
          />
          <ul
            ref={listRef}
            className={styles.list}
            id={listboxId}
            role="listbox"
          >
            {visibleOptions.length === 0 && (
              <li className={styles.noResult}>{noResultLabel}</li>
            )}
            {visibleOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;
              const optionClassName = [
                styles.option,
                option.value === EMPTY_VALUE ? styles.optionEmpty : "",
                isHighlighted ? styles.optionHighlighted : "",
                isSelected ? styles.optionSelected : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li
                  key={`${option.value}-${index}`}
                  ref={(element) => {
                    if (element) {
                      optionRefs.current.set(index, element);
                    } else {
                      optionRefs.current.delete(index);
                    }
                  }}
                  className={optionClassName}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
