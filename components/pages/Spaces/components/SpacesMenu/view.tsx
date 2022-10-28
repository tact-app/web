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
import { HorizontalCollapse } from '../../../../shared/HorizontalCollapse';
import { SpacesMenuOrigin } from './SpacesMenuOrigin';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { SpacesMenuAdd } from './SpacesMenuAdd';

export const SpacesMenuView = observer(function SpacesMenuView(
  props: SpacesMenuProps
) {
  const store = useSpacesMenuStore();
  useHotkeysHandler(store.keyMap, store.hotkeysHandlers);

  return (
    <HorizontalCollapse
      isOpen={store.isExpanded}
      width={72}
      initialWidth={14}
      boxShadow='lg'
    >
      <Box h='100%' alignItems='start' p={2}>
        <IconButton
          m={2}
          display='flex'
          aria-label='Expand'
          onClick={store.handleExpanderClick}
          variant='unstyled'
          size='xs'
        >
          <chakra.div
            width='16px'
            m={0}
            transition='transform 0.2s'
            transform={store.isExpanded ? 'rotate(0)' : 'rotate(180deg)'}
          >
            <ExpandIcon />
          </chakra.div>
        </IconButton>{' '}
        <Accordion
          w='100%'
          onChange={store.handleSpaceChange}
          index={store.isExpanded ? store.currentSpaceIndex : null}
        >
          {store.spaces.map(
            ({ id, name, shortName, color, children }, index) => (
              <AccordionItem
                key={id}
                border={0}
                w='100%'
                mb={1}
                isFocusable={false}
                unselectable='on'
              >
                <AccordionButton
                  borderRadius='lg'
                  overflow='hidden'
                  tabIndex={-1}
                  h={10}
                  bg={
                    store.currentSpaceId === id
                      ? color.replace(/\d+/, (v) => '' + (parseInt(v) - 100))
                      : 'transparent'
                  }
                  p={1}
                  _hover={{
                    bg: color.replace(/\d+/, (v) => '' + (parseInt(v) - 100)),
                  }}
                >
                  <chakra.div
                    borderRadius='full'
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    w={8}
                    minW={8}
                    h={8}
                    fontWeight={600}
                    bg={color}
                    fontSize='lg'
                    color={color.replace(
                      /\d+/,
                      (v) => '' + (parseInt(v) + 200)
                    )}
                  >
                    {shortName}
                  </chakra.div>
                  <Text
                    ml={2}
                    whiteSpace='nowrap'
                    fontSize='md'
                    fontWeight='medium'
                    color={color.replace(
                      /\d+/,
                      (v) => '' + (parseInt(v) + 200)
                    )}
                  >
                    {name}
                  </Text>
                </AccordionButton>
                <AccordionPanel p={0} pl={4}>
                  {children.map((origin) => (
                    <SpacesMenuOrigin
                      key={origin.name}
                      space={id}
                      item={origin}
                    />
                  ))}
                  {index > 0 && (
                    <SpacesMenuAdd
                      onClick={() => undefined}
                      title='Add origin'
                      size='sm'
                    />
                  )}
                </AccordionPanel>
              </AccordionItem>
            )
          )}
        </Accordion>
        <SpacesMenuAdd onClick={() => undefined} title='Add space' size='lg' />
      </Box>
    </HorizontalCollapse>
  );
});
