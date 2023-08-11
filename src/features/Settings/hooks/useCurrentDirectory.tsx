import { useState } from 'react';

export const useCurrentDirectory = () => {
  const noteDirectory = localStorage.getItem('noteDirectory');
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(
    noteDirectory
  );

  const handleChooseDirectory = async () => {
    try {
      const directory = await window.electron.ipcRenderer.invoke(
        'chooseNoteDirectory'
      );
      if (!directory) return;
      setCurrentDirectory(directory);
      // store in local storage
      localStorage.setItem('noteDirectory', directory);
    } catch (err) {
      console.log(err);
    }
  };

  return { currentDirectory, handleChooseDirectory };
};
