# electron-vue-typescript

Electron Vue.js Structure for TypeScript Example

## Installation

```bash
npm ci
cd ./app && npm ci
```

## Development

```bash
npm run dev:renderer # webpack-dev-server
npm run dev:main
```

## Build & Package

```bash
npm run build #= npm run build:renderer && npm run build:main
# Create only the package folder without installation files
npm run pack
# Include installation files
npm run dist
```

## Menu

```javascript
+-- View
|   +-- Home // Vuetify static page
|   +-- Google // Webview-1
|   +-- Google Translate // Webview-2
+-- Data
|   +-- LocalStorage // Read and write data to local storage
|   +-- APIData // Read and write data with the API
|   +-- Reset // Initialize all data
+-- Help
|   +-- Open Logs // Open log folder
|   +-- Open Databases // Open database folder
|   +-- Check for updates... // Version check with API
```

### Using

- [Vuetify](https://vuetifyjs.com)
- [LevelDB](https://github.com/Level/levelup)
