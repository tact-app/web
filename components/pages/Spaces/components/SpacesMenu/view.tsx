import { observer } from 'mobx-react-lite';
import { SpacesMenuProps, useSpacesMenuStore } from './store';
import {
  IconButton,
  chakra,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  Box,
} from '@chakra-ui/react';
import { ExpandIcon } from '../../../../shared/Icons/ExpandIcon';
import { SpacesMenuOrigin } from './SpacesMenuOrigin';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { SpacesMenuAdd } from './SpacesMenuAdd';
import { SpacesSmallIcon } from '../SpacesIcons/SpacesSmallIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { setModifierToColor } from "../../../../../helpers/baseHelpers";

export const SpacesMenuView = observer(function SpacesMenuView(
  props: SpacesMenuProps
) {
  const store = useSpacesMenuStore();

  useHotkeysHandler(store.keyMap, store.hotkeysHandlers, {
    enabled: props.isHotkeysEnabled,
  });

  return (
    <Box
      h='100%'
      alignItems='start'
      p={2}
      onMouseDown={props.callbacks.onFocus}
    >
      <IconButton
        m={2}
        display='flex'
        aria-label='Expand'
        onClick={store.handleExpanderClick}
        variant='unstyled'
        size='xs'
      >
        <chakra.div
          w={6}
          h={6}
          m={0}
          transition='transform 0.2s'
          transform={store.isExpanded ? 'rotate(180deg)' : 'rotate(0)'}
        >
          <ExpandIcon />
        </chakra.div>
      </IconButton>{' '}
      <Accordion
        w='100%'
        onChange={store.handleSpaceChange}
        index={store.isExpanded ? store.currentSpaceIndex : null}
        overflowY='auto'
        height='calc(100% - var(--chakra-sizes-10))'
      >
        {store.root.resources.spaces.list.map((space, index) => {
          const { id, name, color, children } = space;

          return (
            <AccordionItem
              key={id}
              border={0}
              w='100%'
              mb={1}
              isFocusable={false}
              unselectable='on'
            >
              <AccordionButton
                onClick={() => store.handleSpaceClick(index)}
                borderRadius='lg'
                overflow='hidden'
                display='flex'
                justifyContent='space-between'
                tabIndex={-1}
                h={10}
                _focus={{ boxShadow: 'none' }}
                bg={
                  store.currentSpaceId === id &&
                  (store.selectedPath.length === 0 || !store.isExpanded
                    ? setModifierToColor(color, 100)
                    : store.focusedPath.length === 0
                    ? setModifierToColor(color, 75)
                    : 'transparent')
                }
                p={1}
                _hover={{
                  bg: setModifierToColor(color, 75),
                }}
              >
                <Box display='flex' alignItems='center' minWidth={10}>
                  <SpacesSmallIcon space={space} />
                  <Text
                    ml={2}
                    whiteSpace='nowrap'
                    fontSize='md'
                    fontWeight='medium'
                    color={setModifierToColor(color, 500)}
                    overflow='hidden'
                    textOverflow='ellipsis'
                  >
                    {name}
                  </Text>
                </Box>
                {store.currentSpaceId === id && id !== 'all' && (
                  <chakra.div
                    onClick={(e) => {
                      e.stopPropagation();
                      store.callbacks.onSpaceSettingsClick?.(space);
                    }}
                    minW={6}
                    aria-label='space-settings'
                    borderRadius='lg'
                    _hover={{
                      bg: setModifierToColor(color, 100),
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faGear}
                      color={`var(--chakra-colors-${setModifierToColor(color, 500, '-')})`}
                    />
                  </chakra.div>
                )}
              </AccordionButton>
              <AccordionPanel p={0} pl={4}>
                {children?.map((origin) => (
                  <SpacesMenuOrigin key={origin.id} space={id} item={origin} />
                ))}
                {id !== 'all' && (
                  <SpacesMenuAdd
                    isFocused={
                      store.focusedPath.length === 1 &&
                      store.focusedPath[0] === null
                    }
                    onClick={() =>
                      store.callbacks.onSpaceOriginAddClick?.(space)
                    }
                    title='Connect apps'
                    size='sm'
                  />
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        })}

        <SpacesMenuAdd
          onClick={store.callbacks.onSpaceCreationClick}
          isFocused={props.isHotkeysEnabled && store.currentSpaceIndex === null}
          title='Create new space'
          size='lg'
        />
      </Accordion>
    </Box>
  );
});
