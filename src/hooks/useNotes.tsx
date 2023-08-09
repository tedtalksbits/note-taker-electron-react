import {
  useAppDispatch,
  useAppSelector,
} from '@/features/redux/hooks/useRedux';
import { setNotes } from '@/features/redux/slices/notes-slice';
import { Note, NoteDTO } from 'electron/types/note';
import { useEffect } from 'react';

// export const useAddNote = () => {
//   const { getNotes } = useGetNotes();
//   function addNote(
//     newNote: NoteDTO,
//     directory: string,
//     callback: (notes: Note | Error) => void
//   ) {
//     window.electron.notes.addNote(newNote, directory, (res) => {
//       if (res instanceof Error) {
//         console.log(res);
//         callback(res);
//       }
//       getNotes();
//     });
//   }

//   return { addNote };
// };
