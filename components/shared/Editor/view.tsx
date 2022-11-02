import { observer } from 'mobx-react-lite';
import { Box, ButtonGroup, chakra, IconButton, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useEditorStore } from './store';
import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import styles from './Editor.module.css';

export const EditorView = observer(function EditorView() {
  const store = useEditorStore();
  const editor = useEditor({
    extensions: store.extensions,
    content: store.content,
    autofocus: !!store.isFocused,
    onFocus: store.handleFocus,
    onBlur: store.handleBlur,
  });

  useEffect(() => store.setEditor(editor), [store, editor]);

  return (
    <chakra.div
      className={styles.root}
      onClick={store.handleClick}
      bg={'white'}
      cursor='text'
    >
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Box
            boxShadow='lg'
            overflow='hidden'
            w={'auto'}
            borderRadius='md'
            bg='white'
          >
            <ButtonGroup w='100%' isAttached>
              <IconButton
                size='sm'
                variant='ghost'
                colorScheme={editor.isActive('bold') ? 'blue' : 'gray'}
                aria-label={'Bold'}
                icon={<Text>B</Text>}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
              <IconButton
                size='sm'
                variant='ghost'
                colorScheme={editor.isActive('italic') ? 'blue' : 'gray'}
                aria-label={'Italic'}
                icon={<Text>I</Text>}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
              <IconButton
                size='sm'
                variant='ghost'
                colorScheme={editor.isActive('underline') ? 'blue' : 'gray'}
                aria-label={'Underline'}
                icon={<Text>U</Text>}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
            </ButtonGroup>
          </Box>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </chakra.div>
  );
});
