"use client";

import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./components/navbar/Navbar";
import { buildToolNavigationItems } from "./components/navbar/navigation";
import "./globals.css";
import styles from "./shared.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Détermine la clé de navigation active
  const currentNavKey = pathname.includes("/convention")
    ? "convention"
    : pathname.includes("/dossier")
    ? "dossier"
    : pathname.includes("/offres")
    ? "offres"
    : pathname.includes("/devoir")
    ? "devoir"
    : null;

  const navigationItems = currentNavKey
    ? buildToolNavigationItems(currentNavKey)
    : [];

  return (
    <html lang="fr">
      <Head>
        <title>Gestion des stages</title>
        <meta
          name="description"
          content="Coordonnez la production des offres, conventions et dossiers de stages du cégep."
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={styles.pageContainer}>
          {!isHomePage && navigationItems.length > 0 && (
            <Navbar
              ariaLabel="Navigation des outils"
              className={styles.globalNavigation}
              items={navigationItems}
            />
          )}
          {children}
        </div>
      </body>
    </html>
  );
}
