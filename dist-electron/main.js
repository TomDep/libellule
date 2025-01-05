import { app, BrowserWindow } from 'electron';

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1500,
    height: 900,
    minHeight: 400,
    minWidth: 300,
    icon: "../public/favicon.ico"
  });
  return win.loadURL(process.env.VITE_DEV_SERVER_URL);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
//# sourceMappingURL=main.js.map
