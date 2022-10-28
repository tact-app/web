import { Button, chakra } from '@chakra-ui/react';
import { HeavyPlusIcon } from '../../../../shared/Icons/HeavyPlusIcon';
import { SmallHeavyPlusIcon } from '../../../../shared/Icons/SmallHeavyPlusIcon';

export const SpacesMenuAdd = (props: {
  onClick: () => void;
  size: 'sm' | 'lg';
  title: string;
}) => (
  <Button variant='unstyled' p={1} m={0} display='flex' role='group'>
    <chakra.div
      display='flex'
      justifyContent='center'
      alignItems='center'
      borderRadius='full'
      borderWidth={2}
      borderColor='gray.200'
      w={props.size === 'lg' ? 8 : 6}
      h={props.size === 'lg' ? 8 : 6}
      transition='background-color 0.2s ease-in-out'
      _groupHover={{
        bg: 'gray.200',
      }}
    >
      {props.size === 'lg' ? <HeavyPlusIcon /> : <SmallHeavyPlusIcon />}
    </chakra.div>
    <chakra.span color='gray.400' fontSize='md' fontWeight='medium' ml={2}>
      {props.title}
    </chakra.span>
  </Button>
);
