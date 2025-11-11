import {
  ConventionIcon,
  DevoirIcon,
  DossierIcon,
  LogoMark,
  OfferIcon,
} from "../icons/ToolIcons";
import type { ToolNavigationItem, ToolNavigationKey } from "./types";

const BASE_ITEMS: ReadonlyArray<Omit<ToolNavigationItem, "isCurrent">> = [
  {
    key: "home",
    href: "/",
    label: "Menu principal",
    icon: <LogoMark />,
  },
  {
    key: "offres",
    href: "/offres",
    label: "Offres de stage",
    icon: <OfferIcon />,
  },
  {
    key: "convention",
    href: "/convention",
    label: "Convention",
    icon: <ConventionIcon />,
  },
  {
    key: "devoir",
    href: "/devoir",
    label: "Devoir Teams",
    icon: <DevoirIcon />,
  },
  {
    key: "dossier",
    href: "/dossier",
    label: "Dossiers étudiants",
    icon: <DossierIcon />,
  },
];

export function buildToolNavigationItems(
  current: ToolNavigationKey
): ToolNavigationItem[] {
  return BASE_ITEMS.map((item) => ({
    ...item,
    isCurrent: item.key === current,
  }));
}
