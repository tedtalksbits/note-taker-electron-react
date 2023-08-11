import { Button } from '@/components/ui/button';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { Note } from 'electron/types/note';
import dayjs from 'dayjs';
// import dayjs plugin for relative time
import relativeTime from 'dayjs/plugin/relativeTime';
import { Settings } from '../../Settings/Settings';
import { useState } from 'react';
dayjs.extend(relativeTime);
type NoteSidebarProps = {
  notes: Note[];
  selectedNote: Note;
  onNoteSelect: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: () => void;
  onSearch: (query: string) => void;
};
export const NoteSidebar = ({
  notes,
  onDeleteNote,
  onNoteSelect,
  selectedNote,
  onAddNote,
  onSearch,
}: NoteSidebarProps) => {
  const [, setSearchTerm] = useState('');

  // typed debounce function for this use case (searching notes)
  // function debounce<T extends (query:string)=> void>(func: T, timeout = 300) {
  //   let timer: NodeJS.Timeout;
  //   return function (this: ThisParameterType<T>, query: string) {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(this, [query]);
  //     }, timeout);
  //   };
  // }
  // typed debounce function for any use case
  function debounce<T extends (...args: never[]) => void>(
    func: T,
    timeout = 300
  ) {
    let timer: NodeJS.Timeout;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const onSearchDebounced = debounce((query: string) => {
    setSearchTerm(query);
    onSearch(query);
  }, 300);

  if (!notes) {
    return (
      <div className='text-center text-foreground/40'>No note selected</div>
    );
  }
  return (
    <div className='flex flex-col h-full px-2 py-4'>
      <div className='flex flex-col gap-2 mb-4'>
        <input
          className='bg-foreground/10 text-foreground/70 p-2 rounded-lg outline-none border-none'
          placeholder='Search notes'
          onChange={(e) => onSearchDebounced(e.currentTarget.value)}
        />
      </div>
      <header className='flex item-center justify-between p-4 border-b mb-4'>
        <p className='text-xl  font-bold'>Notes</p>
        <Button
          className='bg-foreground/10 w-fit h-fit p-2'
          onClick={onAddNote}
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
