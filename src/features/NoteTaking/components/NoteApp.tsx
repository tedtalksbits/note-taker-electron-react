import { NoteSidebar } from './NoteSidebar';
import { Note } from './Note';
import {
  addNote,
  deleteNote,
  getNotes,
  updateNote,
} from '@/features/NoteTaking/api';
import { NoteDTO, Note as NoteType } from 'electron/types/note';
import { useEffect, useState } from 'react';

const NoteApp = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteType>(notes[0]);
  const [selectedDirectory, setSelectedDirectory] = useState<string>(
    localStorage.getItem('noteDirectory') || ''
  );
  useEffect(() => {
    console.log('getting notes');
    getNotes((notes) => {
      setNotes(notes);
      setSelectedNote(notes[0]);
    });
  }, []);

  function handleNoteUpdate(id: string, note: NoteDTO) {
    updateNote(id, note, (note) => {
      console.log('updated note: ' + note.id);
      getNotes((notes) => {
        setNotes(notes);
      });
    });
  }

  function handleNoteSelect(note: NoteType) {
    setSelectedNote(note);
  }

  function handleNoteDelete(id: string) {
    deleteNote(id, (id) => {
      console.log('deleted note: ' + id);
      getNotes((notes) => {
        setNotes(notes);
      });
    });
  }

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

  function handleAddNote() {
    const newNote: NoteDTO = {
      title: 'New Note',
      content: '',
    };
    addNote(newNote, selectedDirectory, (note) => {
      console.log('added note: ' + note.id);
      getNotes((notes) => {
        setNotes(notes);
      });
    });
  }

  return (
    <div className='grid layout'>
      <div className='sidebar h-screen bg-accent max-w-[350px]'>
        <div className='h-full border-r p-2'>
          <NoteSidebar
            notes={notes}
            onNoteSelect={handleNoteSelect}
            onDeleteNote={handleNoteDelete}
            selectedNote={selectedNote}
            onAddNote={handleAddNote}
          />
        </div>
      </div>
      <div className='main h-screen'>
        <Note
          note={selectedNote}
          onNoteUpdate={handleNoteUpdate}
          key={selectedNote?.id}
        />
      </div>
    </div>
  );
};

export default NoteApp;
