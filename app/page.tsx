"use client";

import type { ReactElement } from "react";
import { FeatureTile, type FeatureTileAccent } from "./components/FeatureTile";
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
    id: "convention",
    title: "Convention",
    description:
      "Génère automatiquement les conventions de stage personnalisées en formats Word et PDF.",
    href: "/convention",
    accent: "convention",
    icon: <ConventionIcon />,
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

function OfferIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function ConventionIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 9a3 3 0 0 1-3 3H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2.5a3 3 0 0 1 2.12.88l1.5 1.5a2 2 0 0 0 2.83 0l1.5-1.5a3 3 0 0 1 2.12-.88H19a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-2a3 3 0 0 1-3-3" />
      <path d="m7 12 2.5 2.5a2 2 0 0 0 2.83 0L15 12" />
      <path d="M12 2v4" />
      <path d="M9 4h6" />
    </svg>
  );
}

function DevoirIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12v8" />
      <path d="m8 16 4 4 4-4" />
      <path d="M20 16.5A4.5 4.5 0 0 0 23 12a4.5 4.5 0 0 0-4.5-4.5" />
      <path d="M19 7.5A6.5 6.5 0 1 0 5.5 12" />
    </svg>
  );
}

function DossierIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h4l2 2h10a2 2 0 0 1 2 2v6.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 17.5V7z" />
      <path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H9l2 2" />
      <path d="M9 14h6" />
    </svg>
  );
}
