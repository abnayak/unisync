const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipcMain = electron.ipcMain;
const path = require('path');
const url = require('url');
const BrowserWindow = electron.BrowserWindow;


let tray = undefined;
let window = undefined;

// Don't show the app icon in the dock
app.dock.hide();

// Inialize the application
app.on('ready', () => {
    createTray();
    createWindow();
})

function createTray() {
    const iconPath = path.join(__dirname, 'assets/icon/sync16x16.png');
    tray = new Tray(iconPath);
    tray.on('right-click', toggleWindow);
    tray.on('double-click', toggleWindow);
    tray.on('click', toggleWindow)
}

function createWindow() {
    window = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            backgroundThrottling: false
        }
    });
    window.loadURL(`file://${path.join(__dirname, 'index.html')}`);


    // Hide the window when it looses focus
    window.on('blur', () => {
        window.hide();
    });
}


function toggleWindow() {
    if (window.isVisible()) {
        window.hide();
    } else {
        showWindow();
    }
}

const getWindowPosition = () => {
    const windowBounds = window.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x: x, y: y }
}

function showWindow() {
    const position = getWindowPosition();
    window.setPosition(position.x, position.y);
    window.show();
    window.focus();
}

// ipcMain.on("show-window", () => {
//     showWindow();
// });
