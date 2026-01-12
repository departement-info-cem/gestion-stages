# Structure des fichiers Excel

## Fichier principal

Le fichier Excel principal doit contenir les informations suivantes pour chaque étudiant/stage:

### Exemple de colonnes

| Nom | Prénom | DA | Courriel étudiant | Entreprise | Adresse entreprise | Ville entreprise | Code postal entreprise | Téléphone entreprise | Courriel entreprise | Nom superviseur | Prénom superviseur | Fonction superviseur | Date début | Date fin | Heures par semaine | Rémunération |
|-----|--------|-----|-------------------|------------|-------------------|------------------|----------------------|---------------------|---------------------|-----------------|-------------------|---------------------|------------|----------|-------------------|--------------|
| Tremblay | Marie | 123-4567 | marie.tremblay@example.com | Acme Corp | 123 rue Principale | Montréal | H1A 1A1 | 514-555-1234 | info@acme.com | Dupont | Jean | Développeur senior | 2025-03-10 | 2025-05-16 | 35 | Oui |
| Gagnon | Pierre | 234-5678 | pierre.gagnon@example.com | Tech Solutions | 456 boul. Tech | Laval | H7A 2B2 | 450-555-5678 | rh@tech.com | Martin | Sophie | Chef de projet | 2025-03-10 | 2025-05-16 | 40 | Non |

### Notes importantes

- **Matricule (DA)**: Doit être au format `XXX-XXXX` (avec trait d'union)
- **Dates**: Format `YYYY-MM-DD` ou nombre Excel
- **Heures par semaine**: Nombre décimal (ex: 35, 37.5, 40)
- **Rémunération**: "Oui" ou "Non" (détermine les clauses dans la convention)
- **Noms des colonnes**: Peuvent varier, le système fait de l'auto-détection

## Fichier additionnel (optionnel)

Le fichier additionnel contient les superviseurs académiques et profils.

### Exemple de colonnes

| Matricule | Superviseur académique | Profil |
|-----------|----------------------|--------|
| 123-4567 | Marie Bélanger | 420.BA |
| 234-5678 | Jean Côté | 420.BB |

### Notes importantes

- **Matricule**: Doit correspondre exactement au matricule du fichier principal
- **Superviseur académique**: Nom complet du professeur superviseur
- **Profil**: Code du profil (420.BA, 420.BB, etc.) - utilisé pour les programmes DEC

## Conseils

1. **Nettoyez vos données** avant l'import:
   - Supprimez les lignes vides
   - Vérifiez les matricules
   - Assurez-vous que les dates sont valides

2. **Format des dates**:
   - Préférez le format `YYYY-MM-DD` (2025-03-10)
   - Les dates Excel (nombres) sont supportées
   - Les dates seront automatiquement formatées en français dans la convention

3. **Noms des colonnes**:
   - Le système fait de l'auto-détection
   - Vous pouvez ajuster manuellement si nécessaire
   - Les noms peuvent contenir des espaces et accents

4. **Validation**:
   - Vérifiez le preview des données avant de générer
   - Les échantillons montrent toutes les lignes détectées
   - La modal permet de voir l'ensemble des données

## Exemples de variations supportées

Le système d'auto-détection reconnaît plusieurs variations de noms de colonnes:

- **Matricule**: DA, Matricule, No. Étu., No. Etu.
- **Prénom**: Prénom, Prenom, Prénom étudiant
- **Entreprise**: Entreprise, Nom entreprise
- **Date début**: Date début, Date debut, Début stage, Debut stage
- **Superviseur académique**: Superviseur académique, Superviseur academique, Prof superviseur

## Encodage

- Utilisez UTF-8 ou Windows-1252 pour les caractères accentués
- Les fichiers Excel (.xlsx) gèrent automatiquement l'encodage
