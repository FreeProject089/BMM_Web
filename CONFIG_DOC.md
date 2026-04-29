# Documentation du fichier `config.json`

Ce fichier centralise toute la configuration du site web **Better Mod.Manager**. Voici la description de chaque champ :

## Paramètres de Version
- **`launchDate`** : Date et heure de l'ouverture publique du site. Avant cette date, une page de "Coming Soon" avec décompte est affichée.
- **`currentVersion`** : Numéro de la version actuelle disponible au téléchargement.
- **`currentVersionDate`** : Date de sortie de la version actuelle (utilisé pour le compteur "Time since current update").

## Prochaine Mise à Jour (`nextUpdate`)
- **`version`** : Le nom/numéro de la prochaine mise à jour (ex: "V0.9.9"). S'affiche dans les titres et labels.
- **`date`** : 
    - Format `YYYY-MM-DDTHH:MM:SS` : Déclenche un décompte précis.
    - Format `YYYY` : Affiche "Next update coming in 2026".
    - Valeur `"TBA"` : Affiche "To Be Announced" (À venir).
- **`timezone`** : Fuseau horaire de référence.

## Media
- **`video.path`** : Chemin vers la vidéo d'arrière-plan (ex: `assets/videos/credits_bg.mp4`).

## Téléchargements (`downloads`)
Contient les liens directs vers les fichiers sur GitHub ou autre :
- **`exe`** : Installateur exécutable Windows.
- **`msi`** : Installateur MSI.
- **`sourceCode`** : Archive ZIP du code source.
- **`devVersion`** : Lien vers la branche de développement (Tdev).

## Liens Externes (`links`)
- **`github`**, **`discord`**, **`forums`** : Liens vers les réseaux sociaux et la communauté.

## Fichiers de Documentation (`files`)
- **`eula`** : Chemins vers les fichiers CLUF par langue (`en`, `fr`).
- **`license`** : Chemin vers le fichier de licence.
- **`latestUpdate`** : Chemins vers les notes de version les plus récentes par langue.

## Source du Suivi d'Avancement (`progressSource`)
Configure d'où proviennent les données du "Progress Tracker" :
- **`type`** : `"url"` (distant) ou `"path"` (local).
- **`url`** : URL vers un fichier JSON distant (ex: GitHub Raw).
- **`path`** : Chemin vers un fichier JSON local (ex: `assets/progress.json`).

## Crédits (`credits`)
- **`creator`** : Nom du créateur.
- **`role`** : Rôle affiché.
- **`poweredBy`** : Technologies utilisées.
- **`year`** : Année affichée dans le copyright.
