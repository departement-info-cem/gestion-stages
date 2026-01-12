# Gestion des stages

Utilitaires pour faciliter la gestion des stages au DEC technique ou à l'AEC.

> Aucune information n'est gardée sur quelconque serveur. Tout se passe localement sur votre navigateur. Les informations des étudiants ne sont hébergées nulle part.

## Modules

### Offres de stage

À implémenter

### Devoir Teams

À implémenter

### Dossiers étudiants

Générer les dossiers qui contiennent les documents que les étudiants et leurs superviseurs vont devoir modifier tout au long de leur stage.

Structure des dossier

- `Evaluation_Entreprise`
  - `NOMS_ETUDIANTS.xlsx` : Évalation de l'étudiant à envoyer à l'entreprise qui reçoit l'étudiant. Identique au fichier `Auto_Evaluation_NOM_ETUDIANT.xlsx`
- `suivis`
  - `NOMS_ETUDIANTS`
    -  `Auto_Evaluation_NOM_ETUDIANT` : Auto-évaluation de l'étudiant. Identique au fichier `NOMS_ETUDIANTS.xlsx` qui se retrouve dans `Evaluation_Entreprise`
    - `Guide_rapport.docx` : Guide de rédaction du rapport que l'étudiant aura à réaliser
    - `README.md` : Instructions pour aider l'étudiant à se retrouver dans son stage.
    - `Suivi_NOM_ETUDIANT.xlsx` : Suivi semaine par semaine du stage

### Convention

Générer les conventions de stage à signer par les différents partis : Direction du CÉGEP, Coordonateur de stage, Étudiant, Représentant de l'entreprise.

Nécessite 2 documents Excel qui contiennent plusieurs informations. Référez vous au document [DOCUMENTS_CONVENTION](https://github.com/departement-info-cem/gestion-stages/blob/main/DOCUMENTS_CONVENTION.md) pour mieux comprendre ce qui doit être fourni comme information.

## Modifier les templates

Certains documents sont générés en se basant sur un *template*. Les template peuvent être modifié dans le répertoire [`public/assets/templates`](https://github.com/departement-info-cem/gestion-stages/tree/main/public/assets/templates).

> Attention, le nom des fichiers ne doit absolument pas changer.

## Développement

### Prérequis

- NodeJS
- NPM
- Environnement de développement recommandé : vscode

### Démarrer le projet

Installer les dépendances avec :

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

Démarrer le serveur avec :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.
