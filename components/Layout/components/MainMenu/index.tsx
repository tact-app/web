import { Stack } from '@chakra-ui/react';
import { MainMenuItemParams } from '../MainMenuItem/types';
import { MainMenuItem } from '../MainMenuItem';

type Props = {
  items: MainMenuItemParams[];
};

export function MainMenu({ items }: Props) {
  return (
    <Stack direction='column'>
      {items.map((navItem) => (
        <MainMenuItem key={navItem.label} item={navItem} />
      ))}
    </Stack>
  );
}
