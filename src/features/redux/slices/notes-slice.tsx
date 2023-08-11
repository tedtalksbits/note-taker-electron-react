import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Note } from 'electron/types/note';

// define the state type
export interface NotesState {
  lastAddedNote: any;
  notes: Note[];
  selectedNote: Note | null;
}

// define the initial state
const initialState: NotesState = {
  notes: [],
  selectedNote: null,
  lastAddedNote: null,
};

// define the reducers
export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      // state.notes = action.payload;
      // notes have non-serializable properties: createdAt, updatedAt
      // so we need to convert them to strings
      state.notes = action.payload.map((note) => ({
        ...note,
        createdAt: note.createdAt.toString(),
        updatedAt: note.updatedAt.toString(),
      }));
    },
    setSelectedNote: (state, action: PayloadAction<Note>) => {
      state.selectedNote = action.payload;
    },
  },
});

// define and export the actions
export const { setNotes, setSelectedNote } = notesSlice.actions;

// define and export the selector
export const selectNotes = (state: RootState) => state.notes.notes;

// export the reducer
export default notesSlice.reducer;
