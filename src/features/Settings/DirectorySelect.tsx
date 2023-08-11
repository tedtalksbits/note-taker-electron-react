import { useCurrentDirectory } from './hooks/useCurrentDirectory';
import { Button } from '@/components/ui/button';

export const DirectorySelect = () => {
  const { currentDirectory, handleChooseDirectory } = useCurrentDirectory();
  return (
    <div>
      <Button
        className='bg-foreground/10 text-foreground'
        onClick={handleChooseDirectory}
      >
        {shortenPath(currentDirectory || 'Choose Directory')}
      </Button>
    </div>
  );
};

function shortenPath(path: string) {
  const splitPath = path.split('/');
  const lastTwo = splitPath.slice(splitPath.length - 2);
  return '...' + lastTwo.join('/');
}
