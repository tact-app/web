import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Box,
  Button,
  HStack,
  Radio,
  RadioGroup,
  Text,
  chakra,
} from '@chakra-ui/react';
import { useSpaceCreationModalStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';

export const SpaceCreationAccountSelect = observer(
  function SpaceCreationAccountSelect() {
    const store = useSpaceCreationModalStore();

    return (
      <Box w='100%' mb={8}>
        <Text fontSize='lg' fontWeight='semibold' mb={2}>
          Choose an account
        </Text>
        <RadioGroup
          display='flex'
          flexDirection='column'
          value={store.selectedAccountId}
          onChange={store.handleAccountSelect}
        >
          {store.root.user.data.accounts.map((account) => (
            <Radio
              size='lg'
              key={account.id}
              value={account.id}
              role='group'
              mb={2}
            >
              <HStack
                spacing={2}
                borderRadius='lg'
                borderWidth='2px'
                borderColor={
                  account.id === store.selectedAccountId
                    ? 'blue.400'
                    : 'gray.200'
                }
                transition='border-color 0.2s ease-in-out'
                p={1.5}
              >
                <Avatar size='sm' src={account.avatar} h={9} w={9} />
                <Box>
                  <Text fontWeight='semibold' fontSize='sm' lineHeight={5}>
                    {account.name}
                  </Text>
                  <Text
                    fontWeight='normal'
                    fontSize='xs'
                    color='gray.400'
                    lineHeight={4}
                  >
                    {account.email}
                  </Text>
                </Box>
              </HStack>
            </Radio>
          ))}
        </RadioGroup>
        <Button
          variant='ghost'
          color='gray.400'
          _hover={{
            color: 'gray.500',
          }}
          display='flex'
          alignItems='center'
          p={0}
          pr={1}
        >
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          <chakra.span ml={1}>Add account</chakra.span>
        </Button>
      </Box>
    );
  }
);
