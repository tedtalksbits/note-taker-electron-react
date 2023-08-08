import { app, ipcMain } from 'electron';
import { Note } from 'electron/types/note';
import Store from 'electron-store';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

const store = new Store();
const notesDirectory = path.join(app.getPath('userData'), 'notes');
export const setUpNotesListeners = () => {
  ipcMain.on('get-notes', async (event) => {
    try {
      const notesPaths = store.get('notesPaths', []) as string[];
      const notes = await Promise.all(
        notesPaths.map(async (notePath) => {
          const noteContent = await fs.readFile(notePath, 'utf-8');
          return JSON.parse(noteContent) as Note;
        })
      );
      event.reply('get-notes-response', notes);
    } catch (error) {
      console.log(error);
      event.reply('get-notes-response', error);
    }
  });

  ipcMain.on('add-note', async (event, note, directory) => {
    try {
      const newNote = {
        ...note,
        id: crypto.randomBytes(16).toString('hex'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const notePath = path.join(directory, `${newNote.id}.json`);
      await fs.writeFile(notePath, JSON.stringify(newNote));
      const notesPaths = store.get('notesPaths', []) as string[];
      store.set('notesPaths', [...notesPaths, notePath]);
      event.reply('add-note-response', newNote);
    } catch (error) {
      console.log(error);
      event.reply('add-note-response', error);
    }
  });

  ipcMain.on('update-note', async (event, id, update) => {
    try {
      const notesPaths = store.get('notesPaths', []) as string[];
      const notePath = notesPaths.find((notePath) =>
        notePath.includes(id)
      ) as string;
      const noteContent = await fs.readFile(notePath, 'utf-8');
      const note = JSON.parse(noteContent) as Note;
      const updatedNote = {
        ...note,
        ...update,
        updatedAt: new Date().toISOString(),
      };
      await fs.writeFile(notePath, JSON.stringify(updatedNote));
      event.reply('update-note-response', updatedNote);
    } catch (error) {
      console.log(error);
      event.reply('update-note-response', error);
    }
  });

  ipcMain.on('delete-note', async (event, id) => {
    try {
      const notesPaths = store.get('notesPaths', []) as string[];
      const notePath = notesPaths.find((notePath) =>
        notePath.includes(id)
      ) as string;
      await fs.unlink(notePath);
      store.set(
        'notesPaths',
        notesPaths.filter((notePath) => !notePath.includes(id))
      );
      event.reply('delete-note-response', id);
    } catch (error) {
      console.log(error);
      event.reply('delete-note-response', error);
    }
  });

  ipcMain.on('get-note', async (event, id) => {
    try {
      const notesPaths = store.get('notesPaths', []) as string[];
      const notePath = notesPaths.find((notePath) =>
        notePath.includes(id)
      ) as string;
      const noteContent = await fs.readFile(notePath, 'utf-8');
      const note = JSON.parse(noteContent) as Note;
      event.reply('get-note-response', note);
    } catch (error) {
      console.log(error);
      event.reply('get-note-response', error);
    }
  });
};
