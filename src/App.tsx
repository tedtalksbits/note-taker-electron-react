import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Note } from 'electron/types/note';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ThemeProvider, useTheme } from './providers/theme-provider';
dayjs.extend(relativeTime);
function App() {
  const [selectedDirectory, setSelectedDirectory] = useState<string>(
    localStorage.getItem('noteDirectory') || ''
  );
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    window.electron.notes.getNotes((notes: Note[]) => {
      setNotes(notes);
    });
    console.log('this effect ran');
  }, []);

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
    window.electron.notes.addNote(
      {
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      selectedDirectory,
      (notes: any) => {
        console.log(notes);
      }
    );
  };

  const handleDelete = (id: string) => {
    window.electron.notes.deleteNote(id, (notes: any) => {
      console.log(notes);
    });
  };

  const { setTheme, theme } = useTheme();

  return (
    <main>
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
      {theme}
      <h1 className='text-white font-bold'>Notes</h1>
      {notes.map((note) => (
        <div className='' key={note.id}>
          <h1 className='font-bold'>{note.title}</h1>
          <p>{note.content}</p>
          <div className='flex justify-between'>
            <p>{dayjs(note.createdAt).fromNow()}</p>
            <Button onClick={() => handleDelete(note.id)}>Delete</Button>
          </div>
        </div>
      ))}
      <div className='bg-muted flex flex-col p-4 gap-2 max-w-2xl mx-auto'>
        <Button onClick={handleChooseDirectory}>Choose Directory</Button>
        <p>{selectedDirectory}</p>
      </div>
      <form
        className='bg-accent flex flex-col p-4 gap-2 max-w-2xl mx-auto'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          name='title'
          className='bg-muted px-2 py-2 rounded-lg ring-1 ring-neutral-200 w-full block'
          placeholder='Title'
        />
        <textarea
          name='content'
          className='bg-muted px-2 py-2 rounded-lg ring-1 ring-neutral-200 w-full block'
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
