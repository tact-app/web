import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  IconButton,
  Input, InputAddon,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton, MenuItem, MenuList, Tag,
  Text, useDisclosure,
  useOutsideClick,
  chakra, Stack, HStack, InputRightAddon, Box, Button,
  Fade
} from '@chakra-ui/react';
import { useTaskInputStore } from './store';
import { TaskInputWrapper } from '../TaskInputWrapper';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskInputView = observer(function TaskInput() {
  const store = useTaskInputStore();
  const ref = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useOutsideClick({
    ref: ref,
    handler: () => {
      store.removeFocus();
      onClose();
    },
  });

  return (
    <TaskInputWrapper variant={!store.focused ? 'primary' : 'focused'} size='md' alignItems='center' mb={6}
                      display='flex'>
      <InputGroup size='md' ref={ref} variant='unstyled'>
        <Input
          size='md'
          placeholder='+Add task'
          value={store.value}
          onChange={store.handleChange}
          onFocus={store.setFocus}
          onKeyDown={store.handleKeyDown}
          ref={store.inputRef}
        />
        <InputRightAddon>
          <HStack>
            <AnimatePresence mode='popLayout'>
              {
                store.tags.map(({title}, index) => (
                  <motion.div
                    layout
                    key={title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'just' }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      variant='unstyled'
                      size='xs'
                      onClick={() => store.removeTag(index, true)}
                      ref={(el) => store.setTagRef(el, index)}
                      onKeyDown={(e) => store.handleTagKeyDown(e, index)}
                    >
                      <Tag
                        bg='blue.400'
                        color='white'
                        cursor='pointer'
                      >
                        {title}
                      </Tag>
                    </Button>
                  </motion.div>
                ))
              }
            </AnimatePresence>
            <chakra.div visibility={store.focused ? 'visible' : 'hidden'}>
              <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
                <MenuButton as={IconButton} aria-label='Task options' variant='solid' h={6} w={6} minW={6} p={1}>
                  <svg viewBox='0 0 18 4' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M7 2C7 3.10457 7.89543 4 9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 -3.91405e-08 9 -8.74228e-08C7.89543 -1.35705e-07 7 0.89543 7 2Z'
                      fill='#A0AEC0'/>
                    <path
                      d='M1.50996e-07 2C1.02714e-07 3.10457 0.89543 4 2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 -3.91405e-08 2 -8.74228e-08C0.895431 -1.35705e-07 1.99278e-07 0.89543 1.50996e-07 2Z'
                      fill='#A0AEC0'/>
                    <path
                      d='M14 2C14 3.10457 14.8954 4 16 4C17.1046 4 18 3.10457 18 2C18 0.89543 17.1046 -3.91405e-08 16 -8.74228e-08C14.8954 -1.35705e-07 14 0.89543 14 2Z'
                      fill='#A0AEC0'/>
                  </svg>
                </MenuButton>
                <MenuList p={0}>
                  <MenuItem fontSize='sm' lineHeight='5' fontWeight='normal' command='!'>
                    Set priority
                  </MenuItem>
                  <MenuItem fontSize='sm' lineHeight='5' fontWeight='normal' command='#' onClick={store.startTag}>
                    Add tag
                  </MenuItem>
                </MenuList>
              </Menu>
            </chakra.div>
          </HStack>
        </InputRightAddon>
      </InputGroup>
    </TaskInputWrapper>
  );
});

//text-sm/lineHeight-5/font-normal