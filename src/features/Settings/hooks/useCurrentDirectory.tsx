export const useCurrentDirectory = () => {
  const currentDirectory = localStorage.getItem('noteDirectory');

  const handleChooseDirectory = async () => {
    try {
      const directory = await window.electron.ipcRenderer.invoke(
        'chooseNoteDirectory'
      );
      if (!directory) return;

      // store in local storage
      localStorage.setItem('noteDirectory', directory);
    } catch (err) {
      console.log(err);
    }
  };

  return { currentDirectory, handleChooseDirectory };
};
