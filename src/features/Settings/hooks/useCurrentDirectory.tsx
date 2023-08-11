export const useCurrentDirectory = () => {
  let currentDirectory = localStorage.getItem('noteDirectory');

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

  const getCurrentDirectory = () => {
    currentDirectory = localStorage.getItem('noteDirectory');
    return localStorage.getItem('noteDirectory');
  };

  return { currentDirectory, handleChooseDirectory, getCurrentDirectory };
};
