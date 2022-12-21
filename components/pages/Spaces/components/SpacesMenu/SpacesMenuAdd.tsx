import { Button, chakra } from '@chakra-ui/react';
import { HeavyPlusIcon } from '../../../../shared/Icons/HeavyPlusIcon';
import { SmallHeavyPlusIcon } from '../../../../shared/Icons/SmallHeavyPlusIcon';

export const SpacesMenuAdd = (props: {
  onClick: () => void;
  isFocused: boolean;
  size: 'sm' | 'lg';
  title: string;
}) => (
  <Button
    onClick={props.onClick}
    variant='unstyled'
    p={1}
    m={0}
    display='flex'
    role='group'
    overflow='hidden'
    justifyContent='start'
    w='100%'
  >
    <chakra.div
      display='flex'
      justifyContent='center'
      alignItems='center'
      borderRadius='full'
      borderWidth={2}
      borderColor='gray.200'
      w={props.size === 'lg' ? 8 : 6}
      minW={props.size === 'lg' ? 8 : 6}
      h={props.size === 'lg' ? 8 : 6}
      bg={props.isFocused ? 'gray.200' : 'transparent'}
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
