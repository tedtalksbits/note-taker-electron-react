import { Note, NoteDTO } from 'electron/types/note';

export const getNotes = (func: (notes: Note[]) => void) => {
  console.log('useGetNotes');
  window.electron.notes.getNotes((res) => {
    if (res instanceof Error) {
      console.log('error', res);
      alert('error! could not get notes');
      return;
    }
    func(res as Note[]);
  });
};

export const addNote = (
  note: NoteDTO,
  directory: string,
  func: (res: Note) => void
) => {
  console.log('addNote');
  window.electron.notes.addNote(note, directory, (res) => {
    if (res instanceof Error) {
      console.log('error', res);
      alert('error adding note');
      return;
    }
    func(res as Note);
  });
};

export const deleteNote = (id: string, func: (id: string) => void) => {
  console.log('deleteNote');
  window.electron.notes.deleteNote(id, (res) => {
    if (res instanceof Error) {
      console.log('error', res);
      alert('error deleting note');
      return;
    }
    func(res as string);
  });
};

export const updateNote = (
  id: string,
  update: NoteDTO,
  func: (res: Note) => void
) => {
  console.log('updateNote');
  window.electron.notes.updateNote(id, update, (res) => {
    if (res instanceof Error) {
      console.log('error', res);
      alert('error updating note');
      return;
    }
    func(res as Note);
  });
};

export const getNote = (id: string, func: (res: Note) => void) => {
  console.log('getNote');
  console.log('id', id);
  window.electron.notes.getNote(id, (res) => {
    if (res instanceof Error) {
      console.log('error', res);
      alert('error getting note');
      return;
    }
    console.log('getNote res: ', res);
    func(res as Note);
  });
};

export const searchNotes = (keyword: string, func: (notes: Note[]) => void) => {
  console.log('searchNotes');
  window.electron.notes.searchNotes(keyword, (res) => {
    if (res instanceof Error) {
      console.log('error', res);
      alert('error searching notes');
      return;
    }
    func(res as Note[]);
  });
};
