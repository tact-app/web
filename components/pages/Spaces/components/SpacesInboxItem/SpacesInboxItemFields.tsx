import { observer } from 'mobx-react-lite';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Divider,
} from '@chakra-ui/react';
import { useSpacesInboxItemStore } from './store';

const SpacesInboxItemsFieldsRow = observer(function SpacesInbotItemsFieldsRow({
  item: { key, value },
}: {
  item: {
    key: string;
    value: string;
  };
}) {
  return (
    <chakra.tr>
      <chakra.th
        color='gray.400'
        fontSize='xs'
        fontWeight='semibold'
        textAlign='left'
        pr={6}
        pt={1.5}
        pb={1.5}
      >
        {key}:
      </chakra.th>
      <chakra.th fontSize='xs' fontWeight='normal' textAlign='left'>
        {value}
      </chakra.th>
    </chakra.tr>
  );
});

export const SpacesInboxItemFields = observer(function SpacesInboxItemFields() {
  const store = useSpacesInboxItemStore();
  const items = store.item.fields || [];
  const firstItems = items.slice(0, 5);
  const lastItems = items.slice(5);

  return items.length ? (
    <Box mt={4}>
      <chakra.table
        style={{
          tableLayout: 'auto',
        }}
        w='auto'
      >
        {firstItems.map((item) => (
          <SpacesInboxItemsFieldsRow key={item.key} item={item} />
        ))}
      </chakra.table>
      {lastItems.length ? (
        <Accordion allowToggle>
          <AccordionItem
            borderWidth={0}
            css={{
              '&:last-of-type': {
                borderBottomWidth: '0 !important',
              },
            }}
          >
            {({ isExpanded }) => (
              <>
                <AccordionPanel p={0}>
                  <chakra.table
                    style={{
                      tableLayout: 'auto',
                    }}
                    w='auto'
                  >
                    {lastItems.map((item) => (
                      <SpacesInboxItemsFieldsRow key={item.key} item={item} />
                    ))}
                  </chakra.table>
                </AccordionPanel>
                <AccordionButton
                  _hover={{
                    bg: 'transparent',
                  }}
                  color='blue.400'
                  fontWeight='semibold'
                  fontSize='xs'
                  p={0}
                  mt={1.5}
                >
                  {isExpanded ? 'Less' : 'More'}
                  <AccordionIcon />
                </AccordionButton>
              </>
            )}
          </AccordionItem>
        </Accordion>
      ) : null}
      <Divider mt={4} />
    </Box>
  ) : null;
});
