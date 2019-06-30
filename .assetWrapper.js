const globalElectronImportAssetProcess = async ({ name, bundler }) => {
  if (name.split(".").pop() === "js") {
    return {
      header: "var electron = require(\"electron\");"
    }
  }
};

module.exports = globalElectronImportAssetProcess;


// {
//   "name": "youtube-sider",
//   "description": "YouTube Sider - watch YouTube videos without distracting from work.",
//   "version": "1.0.0",
//   "main": "./build/index.html",
//   "scripts": {
//   "frontend:start": "cross-env NODE_ENV=development parcel watch ./src/index.html --no-hmr --target=electron --bundle-node-modules --out-dir build --public-url ./",
//     "frontend:build": "cross-env NODE_ENV=production parcel build ./src/index.html --target=electron --bundle-node-modules --out-dir build --public-url ./",
//     "electron:start": "cross-env NODE_ENV=development electron ./src/js/electron.js",
//     "electron:build": "cross-env NODE_ENV=production electron-builder",
//     "clean": "rimraf .cache build/ dist/",
//     "build": "yarn clean && yarn frontend:build && yarn electron:build"
// },
//   "homepage": "./",
//   "build": {
//   "appId": "com.youtube.sider.app",
//     "directories": {
//     "output": "build",
//       "buildResources": "build"
//   },
//   "files": [
//     "./src/electron.js",
//     "./src/assets/*",
//     "./build/**/*"
//   ],
//     "mac": {
//     "target": "dmg",
//       "icon": "./src/assets/logo.icns",
//       "category": "public.app-category.productivity"
//   },
//   "win": {
//     "target": "nsis",
//       "icon": "./src/assets/logo.ico"
//   },
//   "nsis": {
//     "license": "LICENSE",
//       "installerIcon": "./src/assets/logo.ico",
//       "installerHeaderIcon": "./src/assets/logo.ico",
//       "uninstallerIcon": "./src/assets/logo.ico",
//       "allowToChangeInstallationDirectory": false,
//       "deleteAppDataOnUninstall": true,
//       "createDesktopShortcut": true
//   },
//   "linux": {
//     "target": "deb",
//       "icon": "./src/assets/logo.png",
//       "category": "Utility"
//   }
// },
//   "repository": "https://github.com/alphamyd/YouTube-Sider.git",
//   "author": "alphamyd <alphamyd@gmail.com>",
//   "license": "GPL-3.0",
//   "dependencies": {
//   "normalize.css": "^8.0.1",
//     "simptip": "^1.0.4"
// },
//   "devDependencies": {
//   "concurrently": "^4.1.0",
//     "cross-env": "^5.2.0",
//     "electron": "^5.0.2",
//     "electron-builder": "^20.43.0",
//     "electron-reload": "^1.4.0",
//     "node-sass": "^4.12.0",
//     "parcel-bundler": "^1.12.3",
//     "parcel-plugin-wrapper": "^0.2.2",
//     "rimraf": "^2.6.3"
// }
// }
