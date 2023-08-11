import { app, BrowserWindow, dialog, ipcMain, screen } from 'electron';
import path from 'node:path';
import { setUpIpcListeners } from './api/ipc';
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const isMac = process.platform === 'darwin';

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
ipcMain.on('get-test', async (event, arg) => {
  console.log(arg);
  console.log('getTest');
  const mockResponse = {
    name: 'test',
    age: 1,
  };
  event.reply('get-test-response', mockResponse);
});

setUpIpcListeners();

ipcMain.handle('chooseNoteDirectory', async (arg) => {
  console.log(arg);
  console.log('chooseNoteDirectory');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  });

  // if (result.canceled || result.filePaths.length === 0) {
  //   return;
  // }
  const dir = result.filePaths[0];
  if (!dir) {
    return;
  }
  return dir;
});

function createWindow() {
  const isProduction = app.isPackaged;
  const displays = screen.getAllDisplays();

  // load app to on macbook pro retina display when in development
  let display;
  if (!isProduction) {
    const devDisplayLabel = isMac ? 'Built-in Retina Display' : 'DELL U2518D';
    display = displays.find((display) => {
      return display.label.includes(devDisplayLabel);
    });
  } else {
    display = displays.find((display) => {
      return display.bounds.x === 0 && display.bounds.y === 0;
    });
  }

  // load app to display at fullscreen
  // set window size to display size
  const { width, height } =
    display?.workAreaSize || screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'favicon.ico'),
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  !isProduction && win.webContents.openDevTools();

  //move window to display
  win.setPosition(display?.bounds.x || 0, display?.bounds.y || 0);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  win = null;
});

app.whenReady().then(createWindow);
