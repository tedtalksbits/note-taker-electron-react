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
