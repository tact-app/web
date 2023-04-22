import { observer } from 'mobx-react-lite';
import { Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { HotkeyBlock } from "../../../../../../shared/HotkeyBlock";
import { CloseButton } from "../../../../../../shared/CloseButton";
import { useFocusConfigurationStore } from "../../store";

export const FocusConfigurationIntroducing = observer(function FocusConfigurationIntroducing() {
  const store = useFocusConfigurationStore();

  if (store.isIntroducingClosed) {
    return null;
  }

  return (
    <Box mt={5} p={4} borderRadius={16} borderWidth={1} borderColor='gray.200'>
      <Flex alignItems='center' justifyContent='space-between'>
        <Text color='blue.400' fontSize='sm' lineHeight={5} fontWeight='semibold'>It can be easier 😉</Text>
        <CloseButton onlyIcon iconFontSize={16} onClick={store.closeIntroducing} />
      </Flex>
      <Text fontSize='xs' lineHeight={4} mt={2}>
        Take control of your productivity by setting your focus mode.
        Customize it to suit your needs, and then activate it quickly and easily with{' '}
        <HotkeyBlock margin={0} fontSize='xs' lineHeight='inherit' display='inline' hotkey='⌘⇧F' />
      </Text>
      <Text fontSize='xs' lineHeight={4} mt={4}>
        Use hotkeys to enable your focus mode
        and maintain your concentration without interruptions.
      </Text>
    </Box>
  );
});
