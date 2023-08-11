import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { GearIcon } from '@radix-ui/react-icons';
import { ThemeSelect } from './ThemeSelect';
import { DirectorySelect } from './DirectorySelect';

export const Settings = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='ml-auto bg-foreground/10 w-10 h-10 p-2'>
          <GearIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Configure your app settings</SheetDescription>
        </SheetHeader>
        <div className='flex flex-col gap-2 my-4'>
          <div className='border flex items-center justify-between rounded-lg p-2'>
            <h2 className='text-foreground/100'>Theme✨</h2>
            <ThemeSelect />
          </div>
          <div className='border flex items-center justify-between rounded-lg p-2'>
            <h2 className='text-foreground/100'>Directory🗂️</h2>
            <DirectorySelect />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
