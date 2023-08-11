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
import { useCurrentDirectory } from '@/features/Settings/hooks/useCurrentDirectory';

const NoteApp = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteType>(notes[0]);
  // const [selectedDirectory, setSelectedDirectory] = useState<string>(
  //   localStorage.getItem('noteDirectory') || ''
  // );
  const { currentDirectory } = useCurrentDirectory();
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

  function handleAddNote() {
    const newNote: NoteDTO = {
      title: 'New Note',
      content: '',
    };
    addNote(newNote, currentDirectory as string, (note) => {
      console.log('added note: ' + note.id);
      if (!note || !currentDirectory) return;
      getNotes((notes) => {
        setNotes(notes);
      });
    });
  }

  return (
    <div className='grid layout'>
      <div className='sidebar h-screen bg-accent max-w-[350px]'>
        <NoteSidebar
          notes={notes}
          onNoteSelect={handleNoteSelect}
          onDeleteNote={handleNoteDelete}
          selectedNote={selectedNote}
          onAddNote={handleAddNote}
        />
      </div>
      <div className='main h-screen overflow-y-scroll'>
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
