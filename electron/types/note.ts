export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteDTO = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
