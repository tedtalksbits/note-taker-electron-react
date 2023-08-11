import { Button } from '@/components/ui/button';
import { GearIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { Note } from 'electron/types/note';
import dayjs from 'dayjs';
// import dayjs plugin for relative time
import relativeTime from 'dayjs/plugin/relativeTime';
import { Settings } from '../../Settings/Settings';
dayjs.extend(relativeTime);
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
    <div className='flex flex-col h-full px-2 py-4'>
      <header className='flex item-center justify-between p-4 border-b mb-4'>
        <p className='text-xl  font-bold'>Notes</p>
        <Button
          className='bg-foreground/10 w-fit h-fit p-2'
          onClick={() => {
            onAddNote();
            onNoteSelect(notes[notes.length - 1]);
          }}
        >
          <Pencil2Icon />
        </Button>
      </header>
      {notes.map((note) => (
        <div
          className={
            'px-4 py-2 rounded-lg group cursor-pointer' +
            (selectedNote?.id === note?.id ? ' bg-primary is-active' : '')
          }
          key={note?.id}
          onClick={() => onNoteSelect(note)}
        >
          <div className='flex item-center justify-between'>
            <h1 className='font-bold'>{note?.title}</h1>
            <Button
              onClick={() => onDeleteNote?.(note?.id)}
              className='bg-foreground/5 w-fit h-fit p-2 hover:bg-destructive/100'
            >
              <TrashIcon />
            </Button>
          </div>
          <small className='text-foreground/10 group-[.is-active]:text-foreground/40'>
            updated: {toRelativeTime(note?.updatedAt)}
          </small>
        </div>
      ))}
      <footer className='mt-auto'>
        <p className='text-foreground/40 text-center mt-4'>
          {notes?.length} notes
        </p>

        {/* settings */}
        <div className='flex'>
          <Settings />
        </div>
      </footer>
    </div>
  );
};

function toRelativeTime(date: string) {
  return dayjs(date).fromNow();
}
