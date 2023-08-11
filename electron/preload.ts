import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Note, NoteDTO } from './types/note';

export type Channels = string;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
  auth: {
    login(
      username: string,
      password: string,
      func: (...args: unknown[]) => void
    ) {
      ipcRenderer.send('login', username, password);
      ipcRenderer.once('login-response', (_event, ...args) => func(...args));
    },
  },
  notes: {
    getNotes(func: (notes: Note[] | Error) => void) {
      ipcRenderer.send('get-notes');
      ipcRenderer.once('get-notes-response', (_event, notes) => func(notes));
    },
    addNote(
      note: NoteDTO,
      directory: string,
      func: (res: Note | Error) => void
    ) {
      ipcRenderer.send('add-note', note, directory);
      ipcRenderer.once('add-note-response', (_event, note: Note) => func(note));
    },
    updateNote(
      id: string,
      update: NoteDTO,
      func: (...args: unknown[]) => void
    ) {
      ipcRenderer.send('update-note', id, update);
      ipcRenderer.once('update-note-response', (_event, ...args) =>
        func(...args)
      );
    },
    deleteNote(id: string, func: (id: string | Error) => void) {
      ipcRenderer.send('delete-note', id);
      ipcRenderer.once('delete-note-response', (_event, id: string) =>
        func(id)
      );
    },
    getNote(id: string, func: (res: Note | Error) => void) {
      ipcRenderer.send('get-note', id);
      ipcRenderer.once('get-note-response', (_event, note: Note) => func(note));
    },
    searchNotes(keyword: string, func: (notes: Note[] | Error) => void) {
      ipcRenderer.send('search-notes', keyword);
      ipcRenderer.once('search-notes-response', (_event, notes) => func(notes));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;

function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive']
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
