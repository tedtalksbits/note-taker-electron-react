import { authListeners } from './authListeners';
import { setUpNotesListeners } from './notesListeners';

export const setUpIpcListeners = () => {
  authListeners();
  setUpNotesListeners();
};
