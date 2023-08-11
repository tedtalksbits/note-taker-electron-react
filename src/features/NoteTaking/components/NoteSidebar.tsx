import { Button } from '@/components/ui/button';
import { Note } from 'electron/types/note';
type NoteSidebarProps = {
  notes: Note[];
  selectedNote: Note;
  onNoteSelect: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: () => void;
};
export const NoteSidebar = ({
  notes,
  onDeleteNote,
  onNoteSelect,
  selectedNote,
  onAddNote,
}: NoteSidebarProps) => {
  if (!notes) {
    return (
      <div className='text-center text-foreground/40'>No note selected</div>
    );
  }
  return (
    <div>
      <Button onClick={onAddNote}>New</Button>
      {notes.map((note) => (
        <div
          className={
            'px-4 py-2 rounded-lg group' +
            (selectedNote?.id === note?.id ? ' bg-primary is-active' : '')
          }
          key={note?.id}
          onClick={() => onNoteSelect(note)}
        >
          <div className='flex item-center justify-between'>
            <h1 className='font-bold'>{note?.title}</h1>
            <button
              onClick={() => onDeleteNote?.(note?.id)}
              className='text-foreground/20 group-[.is-active]:text-foreground/40'
            >
              Delete
            </button>
          </div>
          <small className='text-foreground/20 group-[.is-active]:text-foreground/40'>
            {note?.updatedAt}
          </small>
        </div>
      ))}
    </div>
  );
};
