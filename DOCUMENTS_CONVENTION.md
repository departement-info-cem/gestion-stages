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
- **Profil**: Optionnel, remplace le nom du programme dans la convention (ex: DEC Régulier → 420.BA Techniques de l'informatique, profil Programmation)

## Auto-détection des colonnes

Le système reconnaît automatiquement plusieurs variations de noms de colonnes :

### Fichier principal

- **etudiant**: `/pour quel étudiant/i`, `/etudiant/i`, `/student/i`
- **entreprise**: `/nom.*entreprise/i`, `/^entreprise$/i`, `/company/i`
- **adresseEntreprise**: `/adresse.*siège/i`, `/adresse.*entreprise/i`, `/adresse.*social/i`
- **nomRepresentant**: `/nom.*représentant/i`, `/nom.*representant/i`, `/nom.*signera/i`
- **titreRepresentant**: `/titre.*représentant/i`, `/poste.*représentant/i`, `/fonction.*représentant/i`
- **courrielEntreprise**: `/courriel.*convention/i`, `/email.*convention/i`, `/courriel.*entreprise/i`
- **nomSuperviseur**: `/nom.*supervisera/i`, `/nom.*superviseur.*entreprise/i`, `/personne.*supervisera/i`
- **heuresParSemaine**: `/nombre.*heure.*semaine/i`, `/heures.*semaine/i`, `/heure.*par.*semaine/i`
- **mandat**: `/description.*mandat/i`, `/mandat/i`, `/description.*stage/i`, `/tâches/i`
- **salaireHoraire**: `/salaire.*horaire/i`, `/taux.*horaire/i`, `/rémunération.*horaire/i`
- **modaliteTeletravail**: `/modalité.*télétravail/i`, `/modalite.*teletravail/i`, `/télétravail/i`
- **dateDebut**: `/date.*début.*stage/i`, `/date.*debut.*stage/i`, `/début.*stage/i`
- **dateFin**: `/date.*fin.*stage/i`, `/fin.*stage/i`

### Fichier additionnel

- **matricule**: `/^matricule$/i`, `/^da$/i`, `/no\.?\s*étu/i`, `/no\.?\s*etu/i`
- **superviseurAcademique**: `/superviseur\s*académique/i`, `/superviseur\s*academique/i`, `/prof\s*superviseur/i`
- **profil**: Détecté automatiquement par regex `/profil/i`

## Conseils d'utilisation

### 1. Préparation des données

- Supprimez les lignes vides
- Vérifiez que tous les matricules sont au bon format
- Assurez-vous que le champ étudiant suit le format `Matricule Nom, Prénom`
- Vérifiez que les dates sont valides

### 2. Format des dates

- **Préféré**: Format Excel (nombre) - sera automatiquement converti
- **Alternative**: Format texte `YYYY-MM-DD` (2025-03-10)
- Les dates vides seront remplacées par les dates par défaut (étape 4)
- Les dates seront formatées en français dans la convention (ex: `10 mars 2025`)

### 3. Salaire et rémunération

- `0` = stage non rémunéré → génère les clauses pour stage non rémunéré
- `> 0` = stage rémunéré → génère les clauses avec le salaire horaire indiqué

### 4. Validation des données

- Utilisez la prévisualisation pour vérifier les échantillons
- La modal "👁️" permet de voir toutes les données détectées
- Les valeurs vides sont affichées comme `(vide)`
- Les dates et salaires vides n'affichent rien

### 5. Dates par défaut (étape 4)

- Configurez des dates par défaut pour les stages sans dates
- Particulièrement utile quand tous les stages ont les mêmes dates
- Les dates par défaut ne remplacent que les champs vides

## Génération des conventions

Une fois les fichiers importés et les colonnes mappées :

1. **Étape 1-2**: Import et mapping du fichier principal
2. **Étape 3**: Import et mapping du fichier additionnel (optionnel)
3. **Étape 4**: Dates par défaut pour les stages sans dates (optionnel)
4. **Étape 5**: Sélection du programme
5. **Étape 6**: Clauses conditionnelles (automatiques selon rémunération)
6. **Étape 7**: Upload des signatures (directeur + coordonnateur)
7. **Génération**: Téléchargement du ZIP avec toutes les conventions

## Encodage et compatibilité

- Fichiers Excel (`.xlsx`) recommandés
- Support des caractères accentués (UTF-8)
- Compatible avec Excel, Google Sheets, LibreOffice Calc
