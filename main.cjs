const { app, BrowserWindow } = require('electron');
const path = require('path');
const axios = require('axios'); // Add axios to handle HTTP requests

function createWindow() {
  // Create a new browser window
  const win = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),  // Secure way to access Node.js in renderer
      contextIsolation: true,  // Isolate the context to prevent global access
      enableRemoteModule: false,  // Disable remote module for security
    },
  });

  // Load your app's HTML (can be a local file or localhost)
  win.loadURL('http://localhost:17348');  // Or use win.loadFile('index.html') if local files

  // Optionally open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  // Example of making an HTTP request using axios in main process
  axios.get('http://localhost:17348')
    .then((response) => {
      console.log('Data fetched from API:', response.data);
      // You can send this data to your renderer process if needed using ipc
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// When Electron is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create a window when the app is activated
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// On all windows closed
app.on('window-all-closed', () => {
  // Close the app on non-macOS platforms
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
