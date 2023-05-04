import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSpaceSelectStore } from '../../store';

type Props = ButtonProps & { index: number; };

export const SpaceSelectItemContainer = observer(
  function SpaceSelectItemContainer({ index, children, ...props }: Props) {
    const store = useSpaceSelectStore();

    return (
      <Button
        variant='unstyled'
        outline='none'
        fontWeight='normal'
        borderRadius='none'
        display='block'
        pt={1.5}
        pb={1.5}
        pr={5}
        pl={4}
        position='relative'
        cursor='pointer'
        w='100%'
        _hover={{ bg: 'gray.100' }}
        _focus={{ outline: 'none', bg: 'gray.100', boxShadow: 'none' }}
        ref={(ref) => store.menuNavigation.setRefs(index, ref)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
