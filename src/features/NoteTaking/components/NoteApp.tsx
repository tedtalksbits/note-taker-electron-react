import { NoteSidebar } from './NoteSidebar';
import { Note } from './Note';
import {
  addNote,
  deleteNote,
  getNotes,
  searchNotes,
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
  const { currentDirectory, handleChooseDirectory, getCurrentDirectory } =
    useCurrentDirectory();
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
    console.log('adding note');
    const dir = getCurrentDirectory();
    if (!dir) return handleChooseDirectory();

    const newNote: NoteDTO = {
      title: 'New Note',
      content: '',
    };
    addNote(newNote, dir as string, (note) => {
      console.log('added note: ' + note.id);
      if (!note) return;
      getNotes((notes) => {
        setNotes(notes);
      });
    });
  }

  function handleSearch(term: string) {
    searchNotes(term, (notes) => {
      setNotes(notes);
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
          onSearch={handleSearch}
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
