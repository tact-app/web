import { observer } from 'mobx-react-lite';
import { Box, ButtonGroup, chakra, IconButton, Text, Input, HStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useEditorStore } from './store';
import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import { faCode, faLink, faCopy, faLinkSlash, faPenToSquare, faCheck } from '@fortawesome/pro-regular-svg-icons';
import styles from './Editor.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCopyToClipboard from '../../../helpers/useCopyToClipboard';

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

  const [handleCopy] = useCopyToClipboard(3000);

  return (
    <chakra.div
      className={styles.root}
      onClick={store.handleClick}
      bg='white'
      cursor='text'
    >
      {editor && (
        <BubbleMenu
            editor={editor}
            tippyOptions={{
              duration: 100,
              placement: 'top-start',
              onClickOutside: store.closeLinkInfoAndForm,
              onHidden: store.closeLinkInfoAndForm,
            }}
        >
          <Box
            boxShadow='lg'
            overflow='hidden'
            w='auto'
            borderRadius='md'
            bg='white'
          >
            {store.isLinkInfoOpened && (
                <HStack w='100%' justifyContent='space-between'>
                  <chakra.a
                      width={150}
                      paddingLeft={2}
                      overflow='hidden'
                      textOverflow='ellipsis'
                      whiteSpace='nowrap'
                      target='_blank'
                      href={store.initialLinkValue}
                  >
                    {store.initialLinkValue}
                  </chakra.a>
                  <ButtonGroup isAttached>
                    <IconButton
                        size='sm'
                        variant='ghost'
                        aria-label='Copy'
                        borderBottomLeftRadius={0}
                        borderTopLeftRadius={0}
                        onClick={() => handleCopy(store.linkValue)}
                    >
                      <FontAwesomeIcon
                          fontSize={14}
                          icon={faCopy}
                          fixedWidth
                      />
                    </IconButton>
                    <IconButton
                        size='sm'
                        variant='ghost'
                        aria-label='Edit'
                        onClick={store.openLinkForm}
                    >
                      <FontAwesomeIcon
                          fontSize={14}
                          icon={faPenToSquare}
                          fixedWidth
                      />
                    </IconButton>
                    <IconButton
                        size='sm'
                        variant='ghost'
                        aria-label='Remove'
                        onClick={store.handleUnsetLink}
                    >
                      <FontAwesomeIcon
                          fontSize={14}
                          icon={faLinkSlash}
                          fixedWidth
                      />
                    </IconButton>
                  </ButtonGroup>
                </HStack>
            )}
            {store.isLinkFormOpened && (
                <HStack
                    w='100%'
                    p={1}
                    justifyContent='space-between'
                    onKeyDown={store.handleLinkFormKeyDown}
                >
                  <Box>
                    <HStack
                        w='100%'
                        justifyContent='space-between'
                        onKeyDown={store.handleLinkFormKeyDown}
                    >
                      <Input
                          value={store.linkValue}
                          size='sm'
                          placeholder='URL'
                          autoFocus
                          onInput={store.updateLinkValue}
                      />
                      <IconButton
                          size='sm'
                          variant='ghost'
                          aria-label='Save'
                          onClick={store.saveNewLinkValue}
                      >
                        <FontAwesomeIcon
                            fontSize={14}
                            icon={faCheck}
                            fixedWidth
                        />
                      </IconButton>
                    </HStack>
                    <HStack
                        w='100%'
                        justifyContent='space-between'
                        onKeyDown={store.handleLinkFormKeyDown}
                        mt={1}
                    >
                      <Input
                          value={store.linkTitle}
                          size='sm'
                          placeholder='Title'
                          onInput={store.updateLinkTitle}
                      />
                      <IconButton
                          size='sm'
                          variant='ghost'
                          aria-label='Remove'
                          onClick={store.handleUnsetLink}
                      >
                        <FontAwesomeIcon
                            fontSize={14}
                            icon={faLinkSlash}
                            fixedWidth
                        />
                      </IconButton>
                    </HStack>
                  </Box>
                </HStack>
            )}
            {!store.isLinkInfoOpened && !store.isLinkFormOpened && (
                <ButtonGroup w='100%' isAttached>
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('bold') ? 'blue' : 'gray'}
                      aria-label='Bold'
                      icon={<Text>B</Text>}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('italic') ? 'blue' : 'gray'}
                      aria-label='Italic'
                      icon={<Text>I</Text>}
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('underline') ? 'blue' : 'gray'}
                      aria-label='Underline'
                      icon={<Text>U</Text>}
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('strike') ? 'blue' : 'gray'}
                      aria-label='Strike'
                      icon={<Text>S</Text>}
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('highlight') ? 'blue' : 'gray'}
                      aria-label='Highlight'
                      icon={<Text>H</Text>}
                      onClick={() => editor.chain().focus().toggleHighlight().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('code') ? 'blue' : 'gray'}
                      aria-label='Code'
                      onClick={() => editor.chain().focus().toggleCode().run()}
                  >
                    <FontAwesomeIcon
                        fontSize={14}
                        icon={faCode}
                        fixedWidth
                    />
                  </IconButton>
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('link') ? 'blue' : 'gray'}
                      aria-label='Link'
                      onClick={store.openLinkInfo}
                  >
                    <FontAwesomeIcon
                        fontSize={14}
                        icon={faLink}
                        fixedWidth
                    />
                  </IconButton>
                </ButtonGroup>
            )}
          </Box>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </chakra.div>
  );
});
