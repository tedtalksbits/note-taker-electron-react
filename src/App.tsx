import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Note } from 'electron/types/note';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTheme } from './providers/theme-provider';
import {
  useAppDispatch,
  useAppSelector,
} from './features/redux/hooks/useRedux';
import { setNotes } from './features/redux/slices/notes-slice';
import { addNote, deleteNote, getNotes } from './features/Note/api';
dayjs.extend(relativeTime);
function App() {
  const dispatch = useAppDispatch();
  const notes = useAppSelector((state) => state.notes.notes);

  const [selectedDirectory, setSelectedDirectory] = useState<string>(
    localStorage.getItem('noteDirectory') || ''
  );

  const onNotesMutation = () => {
    getNotes((notes: Note[]) => {
      dispatch(setNotes(notes));
    });
  };

  useEffect(() => {
    getNotes((notes: Note[]) => {
      dispatch(setNotes(notes));
    });
  }, [dispatch]);

  const handleChooseDirectory = async () => {
    try {
      const directory = await window.electron.ipcRenderer.invoke(
        'chooseNoteDirectory'
      );
      if (!directory) return;
      setSelectedDirectory(directory);
      // store in local storage
      localStorage.setItem('noteDirectory', directory);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const newNote = {
      title,
      content,
    };

    addNote(newNote, selectedDirectory, (newNote) => {
      console.log(newNote);
      onNotesMutation();
    });
  };

  const handleDelete = (id: string) => {
    deleteNote(id, (res) => {
      console.log(res);
      onNotesMutation();
    });
  };

  const { setTheme, theme } = useTheme();

  return (
    <main className='p-4'>
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>

      <h1 className='font-bold'>Notes</h1>
      <div className='bg-muted p-8 my-8 flex flex-col gap-2 rounded-xl'>
        {notes.map((note) => (
          <div className='border-b pb-4 my-8' key={note.id}>
            <h1 className='font-bold'>{note.title}</h1>
            <p>{note.content}</p>
            <div className='flex justify-between'>
              <small className='text-neutral-500'>
                {dayjs(note.createdAt).fromNow()}
              </small>
              <Button
                variant='destructive'
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className='bg-muted flex flex-col p-4 gap-2 max-w-2xl mx-auto border rounded-xl'>
        <Button onClick={handleChooseDirectory}>Choose Directory</Button>
        <p>{selectedDirectory}</p>
      </div>
      <form
        className='bg-card flex flex-col p-4 gap-2 max-w-2xl mx-auto border rounded-xl mt-8'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          name='title'
          className='bg-muted px-2 py-2 rounded-lg border w-full block'
          placeholder='Title'
        />
        <textarea
          name='content'
          className='bg-muted px-2 py-2 rounded-lg border w-full block'
          placeholder='Content'
          id=''
          cols={30}
          rows={10}
        ></textarea>
        <Button type='submit'>Submit</Button>
      </form>
    </main>
  );
}

export default App;
