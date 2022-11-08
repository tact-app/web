import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Container,
  Divider,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useTaskStore } from './store';
import { Editor } from '../Editor';
import { ItemToolbar } from '../ItemToolbar/itemToolbar';
import { SpacesSmallIcon } from '../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon';

export const TaskView = observer(function TaskView() {
  const store = useTaskStore();

  return (
    <Container
      h='100%'
      maxW='container.md'
      p={0}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <Box minH={0} flex={1} pb={6} display='flex' flexDirection='column'>
        <ItemToolbar
          onPreviousItem={store.handlePreviousItem}
          onNextItem={store.handleNextItem}
          onClose={store.handleClose}
          onExpand={store.handleExpand}
          onCollapse={store.handleCollapse}
        />
        <Heading fontSize='2xl' mt={6} fontWeight='semibold'>
          {store.data.title}
        </Heading>
        <Box mt={4} id='editor' overflow='auto'>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <Editor
              content={
                store.description ? store.description.content : undefined
              }
              isFocused={store.isEditorFocused}
              onUpdate={store.handleDescriptionChange}
              onBlur={store.handleDescriptionBlur}
            />
          )}
        </Box>
      </Box>
      {store.data.input && store.inputSpace ? (
        <Box>
          <Divider />
          <Box
            borderColor='gray.200'
            display='flex'
            alignItems='center'
            pt={2}
            pb={2}
          >
            <Button
              borderRadius='md'
              overflow='hidden'
              display='flex'
              justifyContent='center'
              mr={2}
              h={7}
              w={7}
              minW={7}
              bg={store.inputSpace.color + '.100'}
              p={1}
              _hover={{
                bg: store.inputSpace.color + '.75',
              }}
              _active={{
                bg: store.inputSpace.color + '.100',
              }}
            >
              <SpacesSmallIcon space={store.inputSpace} size={6} />
            </Button>
            <Text fontSize='xs' fontWeight='normal'>
              {store.data.input.title}
            </Text>
          </Box>
          <Divider />
        </Box>
      ) : null}
    </Container>
  );
});
