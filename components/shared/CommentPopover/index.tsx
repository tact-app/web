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
} from "@chakra-ui/react";
import React, { ChangeEvent, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "../Tooltip";
import { faComment } from "@fortawesome/pro-light-svg-icons";
import { Textarea } from "../Textarea";

type Props = {
  triggerProps: ButtonProps;
};

export function CommentPopover({ triggerProps }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const ref = useRef();

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handleClose = () => {
    setIsOpen(false);
    setText('');
  };

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      strategy='fixed'
      placement='bottom'
      initialFocusRef={ref}
      onOpen={() => setIsOpen(true)}
      onClose={handleClose}
    >
      <PopoverTrigger>
        <div>
          <Tooltip label='Comment' hotkey='⌥C'>
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
                onChange={handleTextChange}
                onKeyDown={(e) => e.stopPropagation()}
                value={text}
                maxLength={200}
                placeholder='Write here'
              />
              <Button
                key='save-button'
                colorScheme='blue'
                size='sm'
                mt={3}
                onClick={handleClose}
              >
                Send
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Fade>
      </Portal>
    </Popover>
  )
}
