# Better Mod.Manager - Static Website

A static GitHub Pages website for Better Mod.Manager with language selection, countdown timers, EULA, update notes, and credits page.

## Features

- **Pre-launch Countdown**: Large countdown timer with video background before launch date
- **Language Selection**: Easy language switching (English/French) with Tasky mascot
- **EULA Modal**: Displays End User License Agreement in selected language
- **Update Notes Modal**: File explorer with markdown rendering for release notes
- **Main Content**: 
  - Countdown to next update
  - Time since current update
  - Download buttons (EXE, MSI, Source Code)
  - Dev Version link
- **Credits Page**: Full credits with community links
- **Re-openable Modals**: EULA, License, and Update Notes can be re-opened anytime

## Configuration

All settings are configured in `config.json`:

```json
{
  "launchDate": "2026-05-01T18:00:00",
  "currentVersion": "V0.9.8FTB",
  "currentVersionDate": "2026-03-24",
  "nextUpdate": {
    "version": "V0.9.9",
    "date": "2026-05-01T18:00:00",
    "timezone": "Europe/Zurich"
  },
  "video": {
    "path": "assets/videos/credits_bg.mp4",
    "recommendedResolution": "1920x1080"
  },
  "downloads": {
    "exe": "https://...",
    "msi": "https://...",
    "sourceCode": "https://...",
    "devVersion": "https://..."
  },
  "links": {
    "github": "https://...",
    "discord": "https://...",
    "forums": "https://..."
  }
}
```

## Adding New Languages

To add a new language:

1. Create a new JSON file in the `locales/` directory (e.g., `de.json`)
2. Use the same structure as `en.json` or `fr.json`
3. Set the `code`, `suffix`, `name`, and `flag` properties
4. Add the language code to the `script.js` `loadLanguages()` function

Example `de.json`:
```json
{
  "code": "de",
  "suffix": "_DE",
  "name": "Deutsch",
  "flag": "de.svg",
  "languageSelection": {
    "title": "Sprache auswählen",
    "subtitle": "Wählen Sie Ihre Sprache",
    "button": "OK →"
  },
  ...
}
```

## Video Resolution Recommendation

For the background video (`assets/videos/credits_bg.mp4`), the recommended resolution is **1920x1080** (Full HD).

Recommended specifications:
- **Resolution**: 1920x1080
- **Codec**: H.264
- **Bitrate**: 5-10 Mbps
- **Frame Rate**: 30 fps
- **Format**: MP4

This ensures good quality while keeping file size reasonable for web loading.

## File Structure

```
BMM_Web/
├── index.html              # Main HTML file
├── styles.css              # Styling
├── script.js               # JavaScript logic
├── config.json             # Configuration file
├── locales/                # Language files
│   ├── en.json
│   └── fr.json
├── assets/                 # Assets
│   ├── videos/
│   │   └── credits_bg.mp4
│   ├── Tasky/
│   ├── flags/
│   └── Other/
├── Update/                 # Update notes (markdown)
│   ├── Documentation/
│   ├── Guides/
│   ├── Old/
│   ├── Updates/
│   ├── changelog_v0.9.9_EN.md
│   └── changelog_v0.9.9_FR.md
├── EULA_EN.md              # English EULA
├── EULA_FR.md              # French EULA
├── LICENSE.md              # License file
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions workflow
```

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. Push this repository to GitHub
2. Go to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` will automatically deploy on push to `main`

### Manual Deployment

1. Go to **Settings** > **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select `main` branch and `/ (root)` folder
4. Click **Save**

## Local Development

Simply open `index.html` in a web browser. No build process required.

For better development experience, you can use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Customization

### Update Notes File Structure

The update notes file explorer is defined in `script.js` in the `loadUpdateFiles()` function. To add new files or folders, update this object:

```javascript
updateFiles = {
    'Documentation': {
        'New_File_EN.md': 'Update/Documentation/New_File_EN.md',
        'New_File_FR.md': 'Update/Documentation/New_File_FR.md'
    },
    // Add more folders/files as needed
};
```

### Styling

All styles are in `styles.css`. Key CSS variables are defined at the top:

```css
:root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --bg-dark: #0f0f0f;
    --bg-card: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This website is part of Better Mod.Manager project and is licensed under GPL-3.0.
