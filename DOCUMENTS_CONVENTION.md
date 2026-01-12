# Structure des fichiers Excel

## Réponse des entreprises

Au début du mois de janvier, il faut envoyer un formulaire aux entreprises qui ont **confirmées** la venue de stagiaires dans leur entreprise. Les réponses contenues dans ce fichier peuvent être récupérées sous la forme d'un fichier Excel qui est ensuite traité. C'est recommandé de réutiliser le formulaire d'année en année en effectuant quelques modifications.

Le fichier doit contenir les informations suivantes pour chaque étudiant/stage :

### Colonnes requises

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Étudiant** | Format: `Matricule Nom, Prénom` | `123-4567 Tremblay, Marie` |
| **Entreprise** | Nom de l'entreprise | `Acme Corp` |
| **Adresse du siège social** | Adresse complète | `123 rue Principale, Montréal, QC, H1A 1A1` |
| **Représentant** | Nom de la personne qui signera | `Jean Dupont` |
| **Titre du représentant** | Poste/fonction | `Directeur des ressources humaines` |
| **Courriel entreprise** | Courriel du représentant | `j.dupont@acme.com` |
| **Superviseur de stage** | Personne qui supervisera | `Sophie Martin` |
| **Heures par semaine** | Nombre d'heures | `35` |
| **Mandat** | Description des tâches | `Développement d'applications web...` |
| **Salaire horaire** | Montant ou 0 si non rémunéré | `18.50` ou `0` |
| **Modalités télétravail** | Description | `2 jours par semaine en télétravail` |
| **Date de début** | Format Excel ou YYYY-MM-DD | `2025-03-10` |
| **Date de fin** | Format Excel ou YYYY-MM-DD | `2025-05-16` |

### Notes importantes

- **Format étudiant**: Le champ étudiant DOIT être au format `Matricule Nom, Prénom` (ex: `123-4567 Tremblay, Marie`). 
  - Le tiret au centre est important
  - Le matricule doit être suivi d'un espace
  - Le nom et le prénom sont séparés par une virgule
- **Dates**: 
  - Format Excel (nombre) ou texte `YYYY-MM-DD`
  - Les dates seront formatées en français dans la convention
  - Si vides, les dates par défaut (étape 4) seront utilisées
- **Salaire horaire**: 
  - Mettre `0` pour un stage non rémunéré
  - Sinon, le montant détermine automatiquement les clauses de rémunération
- **Noms des colonnes**: Peuvent varier, le système fait de l'auto-détection

## Liste des étudiants

Le fichier permet d'ajouter des informations complémentaires à propos des étudiants, liées par le matricule.

### Colonnes supportées

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Matricule** | Doit correspondre exactement | `123-4567` |
| **Superviseur académique** | Nom du professeur | `Marie Bélanger` |
| **Profil** | Code du profil (pour DEC) | `420.BA` |

### Notes importantes

- **Matricule**: Clé de liaison avec le fichier principal - doit correspondre exactement
- **Superviseur**: Enseignant qui supervisera le stagiaire
- **Profil**: Remplace le nom du programme dans la convention (ex: 420.BA permet de spécifier 420.BA Techniques de l'informatique, profil Programmation)
