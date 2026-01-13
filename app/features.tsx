import { ReactElement } from "react";
import { ConventionIcon } from "./assets/icons/ConventionIcon";
import { DossierIcon } from "./assets/icons/DossierIcon";
import { OfferIcon } from "./assets/icons/OfferIcon";
import { DevoirIcon } from "./components/icons/ToolIcons";
import { FeatureTile, type FeatureTileAccent } from "./components/feature-tile/FeatureTile";

type FeatureIdentifier = "offre" | "convention" | "devoir" | "dossier";

interface FeatureDefinition {
  id: FeatureIdentifier;
  title: string;
  description: string;
  href: string;
  accent: FeatureTileAccent;
  icon: ReactElement;
}

export const features: FeatureDefinition[] = [
  {
    id: "offre",
    title: "Offres de stage",
    description:
      "Assemble les offres de stage et exporte les pages HTML prêtes à publier pour les étudiants.",
    href: "/offres",
    accent: "offre",
    icon: <OfferIcon />,
  },
  {
    id: "devoir",
    title: "Devoir Teams",
    description:
      "Synchronise et récupère la version la plus récente des CV déposés sur Teams.",
    href: "/devoir",
    accent: "devoir",
    icon: <DevoirIcon />,
  },
  {
    id: "dossier",
    title: "Dossiers étudiants",
    description:
      "Crée et partage les dossiers de suivi comprenant rapports hebdomadaires et guides.",
    href: "/dossier",
    accent: "dossier",
    icon: <DossierIcon />,
  },
  {
    id: "convention",
    title: "Convention",
    description:
      "Génère automatiquement les conventions de stage personnalisées en formats Word et PDF.",
    href: "/convention",
    accent: "convention",
    icon: <ConventionIcon />,
  },
];