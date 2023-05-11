import {
  chakra,
  Button,
  ButtonProps,
  Fade,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  Table,
  Tbody,
  Td,
  Tr,
  Avatar,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactNode, useEffect, useState, KeyboardEvent } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "../Tooltip";
import { faSquareInfo, faXmark } from "@fortawesome/pro-light-svg-icons";
import { UserData } from "../../../stores/RootStore/UserStore";

type Metadata = {
  date?: string;
  user?: UserData;
};

type Props = {
  isOpen?: boolean;
  onToggleOpen?(open: boolean): void;
  triggerProps: ButtonProps;
  created?: Metadata;
  updated?: Metadata;
};

export function EntityMetadataPopover({ isOpen: open, onToggleOpen, triggerProps, created, updated }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(open);

  useEffect(() => {
    setIsPopoverOpen(open);
  }, [open]);

  const handleToggle = (open: boolean) => {
    setIsPopoverOpen(open);
    onToggleOpen?.(open);
  };

  const { isOpen, onClose, onOpen } = useDisclosure({
    isOpen: isPopoverOpen,
    onClose: () => handleToggle(false),
    onOpen: () => handleToggle(true),
  });

  const renderUser = (user?: UserData) => {
    if (!user) {
      return null;
    }

    return (
      <Flex alignItems='center'>
        <Avatar size='sm' src={user.avatar} title={user.name} />
        <Text ml={1}>{user.name}</Text>
      </Flex>
    );
  };

  const renderTableRow = (title: string, value?: ReactNode) => (
    <Tr border={0} _last={{ td: { pb: 0 } }}>
      <Td pl={0} pt={1} pb={4} border={0} color='gray.400' lineHeight={5} minW='100'>
        {title}:
      </Td>
      <Td pt={0} pb={4} border={0} color='gray.700' lineHeight={5}>
        {value || 'unknown'}
      </Td>
    </Tr>
  );

  const handleContainerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      handleToggle(false);
    }
  };

  return (
    <div onKeyDown={handleContainerKeyDown}>
      <Popover
        isLazy
        closeOnEsc={false}
        isOpen={isOpen}
        strategy='fixed'
        placement='bottom'
        onOpen={onOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <div>
            <Tooltip label='Information' hotkey='⌥I'>
              <Button
                variant='ghost'
                size='xs'
                color='gray.500'
                pl={0.5}
                pr={0.5}
                h={7}
                aria-label='Info'
                {...triggerProps}
              >
                <FontAwesomeIcon
                  fontSize={20}
                  icon={faSquareInfo}
                  fixedWidth
                />
              </Button>
            </Tooltip>
          </div>
        </PopoverTrigger>
        <Portal>
          <Fade in={isOpen} unmountOnExit>
            <PopoverContent borderRadius='12' borderColor='gray.200'>
              <PopoverBody p={6} position='relative'>
                <Text fontWeight='semibold' fontSize='md' color='gray.700'>Information</Text>
                {Boolean(created) && (
                  <Table variant='simple' size='sm' width='auto' mt={4}>
                    <Tbody>
                      {renderTableRow('Created at', created.date)}
                      {renderTableRow('Created by', renderUser(created.user))}
                    </Tbody>
                  </Table>
                )}
                {Boolean(updated) && updated.date && [
                  <chakra.p key='separator' borderBottomWidth={1} borderColor='gray.200' width='100%' mt={4} />,
                  <Table key='update-table' variant='simple' size='sm' width='auto' mt={4}>
                    <Tbody>
                      {renderTableRow('Updated at', updated.date)}
                      {renderTableRow('Updated by', renderUser(updated.user))}
                    </Tbody>
                  </Table>
                ]}

                <Button
                  variant='ghost'
                  size='xs'
                  color='gray.500'
                  minW='auto'
                  h='auto'
                  p={1}
                  position='absolute'
                  right={6}
                  top={6}
                  onClick={onClose}
                >
                  <FontAwesomeIcon
                    fontSize={22}
                    icon={faXmark}
                    fixedWidth
                  />
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Fade>
        </Portal>
      </Popover>
    </div>
  )
}
