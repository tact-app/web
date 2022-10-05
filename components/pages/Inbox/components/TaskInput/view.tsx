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
import { DotsIcon } from '../TaskIcons/DotsIcon';
import { TaskPriorityIcon } from '../TaskIcons/TaskPriorityIcon';

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
            <IconButton aria-label='priority' variant='unstyled' size='xs'>
              <TaskPriorityIcon priority={store.priority} />
            </IconButton>
            <chakra.div visibility={store.focused ? 'visible' : 'hidden'}>
              <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
                <MenuButton as={IconButton} aria-label='Task options' variant='solid' h={6} w={6} minW={6} p={1}>
                  <DotsIcon/>
                </MenuButton>
                <MenuList p={0}>
                  <MenuItem fontSize='sm' lineHeight='5' fontWeight='normal' command='!' onClick={store.startPriority}>
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