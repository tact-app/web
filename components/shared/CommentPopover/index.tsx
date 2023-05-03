import {
  Button,
  ButtonProps,
  Fade,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '../Tooltip';
import { faComment } from '@fortawesome/pro-light-svg-icons';
import { Textarea } from '../Textarea';
import { NavigationDirections } from '../../../types/navigation';
import { NavigationHelper } from '../../../helpers/NavigationHelper';

type Props = {
  isOpen?: boolean;
  onToggleOpen?(open: boolean): void;
  triggerProps: ButtonProps;
};

export function CommentPopover({ isOpen: open = false, onToggleOpen, triggerProps }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(open);
  const [text, setText] = useState('');

  const ref = useRef<HTMLTextAreaElement>();
  const buttonRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    setIsPopoverOpen(open);
  }, [open]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleToggle = (open: boolean) => {
    setText('');
    setIsPopoverOpen(open);
    onToggleOpen?.(open);
  };

  const { isOpen, onClose, onOpen } = useDisclosure({
    isOpen: isPopoverOpen,
    onClose: () => handleToggle(false),
    onOpen: () => handleToggle(true),
  });

  const handleTextareaNavigate = (direction: NavigationDirections, event: KeyboardEvent) => {
    if ([NavigationDirections.DOWN, NavigationDirections.TAB].includes(direction)) {
      event.preventDefault();
      buttonRef.current?.focus();
    } else if ([NavigationDirections.BACK, NavigationDirections.INVARIANT].includes(direction)) {
      handleToggle(false);
    }
  };

  const handleButtonKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();

    const direction = NavigationHelper.castKeyToDirection(event.key, event.shiftKey);

    if ([NavigationDirections.UP, NavigationDirections.BACK].includes(direction)) {
      event.preventDefault();
      ref.current?.focus();
    } else if (direction === NavigationDirections.INVARIANT) {
      handleToggle(false);
    }
  };

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      strategy='fixed'
      placement='bottom'
      initialFocusRef={ref}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <div>
          <Tooltip label='Comment' hotkey='Press C'>
            <Button
              variant='ghost'
              size='xs'
              color='gray.500'
              pl={0.5}
              pr={0.5}
              h={7}
              aria-label='Comment'
              {...triggerProps}
            >
              <FontAwesomeIcon
                fontSize={20}
                icon={faComment}
                fixedWidth
              />
            </Button>
          </Tooltip>
        </div>
      </PopoverTrigger>
      <Portal>
        <Fade in={isOpen} unmountOnExit>
          <PopoverContent borderRadius='12' borderColor='gray.200'>
            <PopoverBody p={6} position='relative'>
              <Text color='gray.700' mb={3}>
                The notification center is under development. Could you please describe how you will plan to use it?
              </Text>
              <Textarea
                ref={ref}
                onBlur={(e) => e.stopPropagation()}
                onChange={handleTextChange}
                onNavigate={handleTextareaNavigate}
                value={text}
                maxLength={200}
                placeholder='Write here'
              />
              <Button
                ref={buttonRef}
                key='save-button'
                colorScheme='blue'
                size='sm'
                mt={3}
                onKeyDown={handleButtonKeyDown}
                onClick={onClose}
              >
                Send
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Fade>
      </Portal>
    </Popover>
  );
}
