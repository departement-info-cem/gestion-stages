"use client";

import { FeatureTile } from "./components/feature-tile/FeatureTile";
import styles from "./page.module.css";
import { features } from "./features";

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
