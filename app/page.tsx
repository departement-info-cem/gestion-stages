"use client";

import type { ReactElement } from "react";
import { FeatureTile, type FeatureTileAccent } from "./components/FeatureTile";
import {
  ConventionIcon,
  DevoirIcon,
  DossierIcon,
  OfferIcon,
} from "./components/icons/ToolIcons";
import styles from "./page.module.css";

type FeatureIdentifier = "offre" | "convention" | "devoir" | "dossier";

interface FeatureDefinition {
  id: FeatureIdentifier;
  title: string;
  description: string;
  href: string;
  accent: FeatureTileAccent;
  icon: ReactElement;
}

const features: FeatureDefinition[] = [
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

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.surface}>
        <section className={styles.intro}>
          <h1 className={styles.title}>Gestion des stages du cégep</h1>
          <p className={styles.tagline}>
            Centralisez la préparation des documents, la diffusion des offres et
            le suivi des étudiants en un seul endroit. Choisissez un module pour
            démarrer.
          </p>
        </section>
        <section className={styles.tiles}>
          {features.map((feature) => (
            <FeatureTile key={feature.id} {...feature} />
          ))}
        </section>
      </main>
    </div>
  );
}
