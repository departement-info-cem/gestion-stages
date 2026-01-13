# Templates de conventions de stage

Ce dossier contient les templates Word (.docx) utilisés pour générer les conventions de stage.

## Structure requise

Les templates doivent contenir les placeholders suivants au format `{PLACEHOLDER}`:

### Informations du programme
- `{NOMPROGRAMME}` - Nom complet du programme
- `{SIGLECOURS}` - Sigle du cours de stage
- `{NOMDIRECTION}` - Nom de la direction (études ou formation continue)

### Informations de l'étudiant
- `{ETUDIANTNOM}` - Nom complet de l'étudiant (prénom + nom)
- `{MATRICULE}` - Matricule de l'étudiant

### Informations de l'entreprise
- `{NOMENTREPRISE}` - Nom de l'entreprise
- `{adresseEntreprise}` - Adresse complète de l'entreprise
- `{villeEntreprise}` - Ville de l'entreprise
- `{codePostalEntreprise}` - Code postal de l'entreprise
- `{telephoneEntreprise}` - Téléphone de l'entreprise
- `{courrielEntreprise}` - Courriel de l'entreprise

### Informations du superviseur
- `{nomSuperviseur}` - Nom complet du superviseur en entreprise
- `{fonctionSuperviseur}` - Fonction/titre du superviseur
- `{nomProfSuperviseur}` - Nom du superviseur académique

### Informations du stage
- `{nombreHeuresStage}` - Nombre minimum d'heures du stage
- `{nombreSemaineStage}` - Nombre de semaines du stage
- `{nombreHeuresSemaine}` - Nombre d'heures par semaine
- `{nombreJoursOuvrables}` - Nombre de jours ouvrables calculés

### Dates
- `{DATE_STAGE_DEBUT}` - Date de début du stage (format français)
- `{DATE_STAGE_FIN}` - Date de fin du stage (format français)
- `{DATE_DU_JOUR}` - Date du jour (format français)

### Clauses conditionnelles
- `{CLAUSE_1_4}` - Clause 1.4 (varie selon rémunération)
- `{CLAUSE_1_5}` - Clause 1.5 (varie selon rémunération)
- `{CLAUSE_1_6}` - Clause 1.6 (varie selon rémunération)

### Signatures
- `{SIGNATURE_DIRECTEUR}` - Image de la signature du directeur adjoint
- `{SIGNATURE_COORDONNATEUR}` - Image de la signature du coordonnateur
- `{NOM_DIRECTEUR}` - Nom du directeur adjoint
- `{NOM_COORDONNATEUR}` - Nom du coordonnateur

## Types de templates

### ConventionDEC.docx
Template pour les programmes DEC (Techniques de l'informatique, Cybersécurité)

### ConventionAEC.docx
Template pour les programmes AEC (Développement Web, TI, Programmation)

## Notes importantes

1. Les placeholders doivent être écrits exactement comme indiqué (sensible à la casse)
2. Les images de signature sont insérées automatiquement avec une taille de 150px × 50px
3. Les clauses conditionnelles changent automatiquement selon si le stage est rémunéré ou non
4. Les dates sont automatiquement formatées en français (ex: "12 janvier 2026")
