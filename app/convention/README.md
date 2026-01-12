# Module de génération des conventions de stage

Ce module permet de générer automatiquement des conventions de stage au format Word (.docx) à partir de fichiers Excel.

## Fonctionnalités

### Workflow en 7 étapes

1. **Sélection du programme** - Choix parmi DEC Informatique, DEC Cybersécurité, AEC Dev Web, AEC TI, AEC Programmation
2. **Fichier Excel principal** - Upload et sélection de l'onglet contenant les données des stages
3. **Association des colonnes principales** - Mapping automatique des 17 colonnes requises avec preview
4. **Fichier Excel additionnel** - Upload optionnel pour les superviseurs académiques et profils
5. **Association des colonnes additionnelles** - Mapping pour matricule et superviseur académique
6. **Signatures** - Upload de 2 signatures (PNG/JPEG) avec noms des signataires
7. **Génération** - Création d'un fichier ZIP contenant toutes les conventions

### Colonnes requises (fichier principal)

- Nom, Prénom, DA (matricule), Courriel étudiant
- Entreprise, Adresse entreprise, Ville entreprise, Code postal entreprise
- Téléphone entreprise, Courriel entreprise
- Nom superviseur, Prénom superviseur, Fonction superviseur
- Date début, Date fin, Heures par semaine
- Rémunération

### Colonnes requises (fichier additionnel)

- Matricule
- Superviseur académique

## Architecture technique

### Composants principaux

- `ProgramSelector` - Sélection du programme
- `ExcelImportSection` - Upload et sélection d'onglet Excel (réutilisable)
- `ColumnMappingSection` - Wrapper pour le ColumnMapper générique
- `AdditionalExcelConfig` - Configuration du fichier additionnel
- `AdditionalColumnMapping` - Mapping des colonnes additionnelles
- `SignatureUpload` - Upload des signatures
- `GenerationSection` - Bouton de génération et messages de statut

### Hook principal

`useConventionGenerator` - Gère tout l'état et la logique du module:
- État des fichiers Excel
- Mapping des colonnes
- Auto-détection des colonnes
- Extraction des échantillons
- Upload des signatures
- Génération des documents

### Utilitaires

`utils.ts` contient:
- `calculateWorkingDays` - Calcul des jours ouvrables
- `formatDateFrench` - Formatage des dates en français
- `autoMapColumns` - Détection automatique des colonnes
- `extractColumnSamples` - Extraction des échantillons (toutes les lignes)
- `generateConventionData` - Fusion des données des deux fichiers
- `generateConventionDocument` - Génération d'un document Word avec docxtemplater

### Constantes

`constants.ts` définit:
- `PROGRAMS` - Configurations des programmes (code, nom, template, etc.)
- `MAIN_FILE_FIELDS` - Champs du fichier principal
- `ADDITIONAL_FILE_FIELDS` - Champs du fichier additionnel
- `CLAUSES` - Clauses conditionnelles selon rémunération

### Types

`types.ts` contient toutes les interfaces TypeScript pour la sécurité de type.

## Particularités

### Auto-mapping intelligent

Le système détecte automatiquement les colonnes Excel basé sur des patterns regex:
- Supporte les variations d'orthographe (avec/sans accents)
- Reconnaît les abréviations courantes
- Gère les espaces et la casse

### Preview des données

- Affiche TOUTES les lignes (pas limité à 5)
- Zone scrollable avec hauteur max de 8rem
- Synchronisation du scroll entre colonnes
- Bouton "œil" pour modal avec preview complète

### Génération de documents

- Utilise `docxtemplater` + `docxtemplater-image-module` + `pizzip`
- Insertion automatique des signatures (150px × 50px)
- Remplacement des placeholders
- Clauses conditionnelles selon rémunération
- Calculs automatiques (jours ouvrables, dates formatées)
- Nom des fichiers: `Convention_{NOM}_{PRENOM}.docx`

### Jointure des données

Les données du fichier principal et additionnel sont jointes via le matricule:
- Permet d'ajouter le superviseur académique
- Permet d'ajouter le profil de l'étudiant (pour DEC)
- Gère les cas où l'étudiant n'est pas dans le fichier additionnel

### Validation

Avant génération, validation de:
- Programme sélectionné
- Fichier principal et onglet
- Mapping complet des colonnes principales
- Présence des deux signatures
- Noms des signataires remplis

## Dépendances

- `docxtemplater` - Manipulation de documents Word
- `docxtemplater-image-module` - Insertion d'images
- `pizzip` - Gestion des fichiers ZIP (pour Word)
- `jszip` - Création du ZIP final
- `xlsx` - Lecture des fichiers Excel
- `file-saver` - Téléchargement du ZIP

## Layout responsive

- Grille 2 colonnes sur desktop
- Étapes 3 et 5 prennent toute la largeur
- Passe en 1 colonne sur mobile (< 1024px)

## Messages de statut

Système de notifications avec:
- Type: success, error, warning
- Message descriptif
- Horodatage
- Affichage des 10 derniers messages
- Zone scrollable

## Styles

Utilise des modules CSS séparés pour chaque composant:
- `page.module.css` - Layout principal
- `ProgramSelector.module.css` - Sélecteur de programme
- `ExcelImportSection.module.css` - Import Excel
- `AdditionalExcelConfig.module.css` - Config additionnelle
- `SignatureUpload.module.css` - Upload signatures
- `GenerationSection.module.css` - Section génération
- `shared.module.css` - Styles partagés (compatibles avec ColumnMapper)
- `modal.module.css` - Styles de modal (pour preview)

## Support du dark mode

Tous les composants supportent le thème sombre via `prefers-color-scheme: dark`.
