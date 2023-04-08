import React, { ReactNode } from 'react';
import { Fade, Popover, PopoverBody, PopoverContent, PopoverTrigger, Portal } from '@chakra-ui/react';

type Props = {
  trigger: ReactNode;
  content: ReactNode;
  isOpen?: boolean;
  onOpen?(): void;
  onClose?(): void;
};

export function GoalCreationToolbarPopover({
  trigger,
  content,
  isOpen,
  onClose,
  onOpen,
}: Props) {
  return (
    <Popover
      isLazy
      isOpen={isOpen}
      strategy='fixed'
      placement='bottom'
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <div>{trigger}</div>
      </PopoverTrigger>
      <Portal>
        <Fade in={isOpen} unmountOnExit>
          <PopoverContent>
            <PopoverBody p={0}>
              {content}
            </PopoverBody>
          </PopoverContent>
        </Fade>
      </Portal>
    </Popover>
  );
}
