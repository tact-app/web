import { observer } from 'mobx-react-lite';
import { Button, Text } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import React, { ReactNode } from "react";
import { HotkeyBlock } from "../../../../shared/HotkeyBlock";

type Props = {
  children: ReactNode;
  withHotkey?: boolean;
}

export const GoalCreateNewButton = observer(function GoalCreateNewButton({ children, withHotkey }: Props) {
  const store = useGoalsStore();

  return (
    <>
      <Button
        onClick={store.startGoalCreation}
        size='md'
        minH={8}
        mb={2}
        bg='blue.400'
        color='white'
        _hover={{
          bg: 'blue.500',
        }}
        _focus={{
          boxShadow: 'var(--chakra-shadows-outline)',
          outline: 'none',
        }}
      >
        {children}
      </Button>
      {withHotkey && (
        <Text
          fontSize='xs'
          fontWeight='normal'
          lineHeight={4}
          color='gray.400'
          display='flex'
          justifyContent='center'
        >
          Press
          <HotkeyBlock hotkey='N' ml={1} fontSize='xs' lineHeight={4} />
        </Text>
      )}
    </>
  );
});
