import { updateNote } from '@/features/NoteTaking/api';
import { NoteDTO, Note as NoteType } from 'electron/types/note';
import React, { useState } from 'react';
type NoteProps = {
  note: NoteType;
  onNoteUpdate: (id: string, note: NoteDTO) => void;
  className?: string;
};
export const Note = ({ note, onNoteUpdate, className }: NoteProps) => {
  const [didUpdate, setDidUpdate] = useState(false);
  const [noteUpdated, setNoteUpdated] = useState<NoteDTO>({
    title: note?.title,
    content: note?.content,
  });
  if (!note) {
    return (
      <div className='text-center text-foreground/40'>No note selected</div>
    );
  }

  return (
    <div className='text-foreground p-4'>
      <input
        className='font-bold bg-transparent outline-none border-none w-full'
        value={noteUpdated?.title}
        onChange={(e) => {
          setNoteUpdated({ ...noteUpdated, title: e.currentTarget.value });
          setDidUpdate(true);
        }}
        onBlur={() => {
          if (didUpdate) {
            onNoteUpdate(note.id, noteUpdated);
            setDidUpdate(false);
          }
        }}
      />
      <div className='flex flex-col h-full relative'>
        <div
          contentEditable
          dangerouslySetInnerHTML={{ __html: note?.content }}
          onInput={(e) => {
            // console.log(e.currentTarget.innerHTML);
            setNoteUpdated({
              ...noteUpdated,
              content: e.currentTarget.innerHTML,
            });
            setDidUpdate(true);
          }}
          onBlur={() => {
            if (didUpdate) {
              onNoteUpdate(note.id, noteUpdated);
              setDidUpdate(false);
              console.log(noteUpdated);
              console.log(note);
            }
          }}
          className={`border-none outline-none ${className}`}
        ></div>

        {didUpdate && (
          <div className='text-foreground/50 text-right absolute top-0 right-0'>
            <small>Unsaved changes</small>
          </div>
        )}
      </div>
    </div>
  );
};
