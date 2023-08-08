import { ipcMain } from 'electron';

export const authListeners = () => {
  ipcMain.on('login', async (event, arg) => {
    console.log(arg);
    console.log('login');
    const mockResponse = {
      name: 'password',
      age: 1,
    };
    event.reply('login-response', mockResponse);
  });
  ipcMain.on('register', async (event, arg) => {
    console.log(arg);
    console.log('register');
    const mockResponse = {
      name: 'password',
      age: 1,
    };
    event.reply('register-response', mockResponse);
  });
};
