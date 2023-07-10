import { chakra, Tooltip, Box, Text } from '@chakra-ui/react';
import NavLink from '../../../shared/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MainMenuItemParams } from './types';

type Props = {
  item: MainMenuItemParams;
};

export function MainMenuItem({ item }: Props) {
  const renderContent = (isActive?: boolean) => (
    <chakra.span
      w={10}
      h={10}
      fontWeight={400}
      bg={isActive ? 'gray.300' : 'transparent'}
      borderRadius='lg'
      display='flex'
      justifyContent='center'
      alignItems='center'
      _hover={{
        bg: isActive ? 'gray.300' : 'gray.200',
      }}
    >
      <chakra.span h={5}>
        <FontAwesomeIcon
          fixedWidth
          icon={item.icon}
          fontSize={20}
          height={20}
        />
      </chakra.span>
    </chakra.span>
  );

  return (
    <Tooltip
      label={
        <Box display='flex' alignItems='center' flexDirection='column'>
          {item.label}
          <Text fontSize='xs' color='gray.400' fontWeight='normal'>
            {item.hotkey?.()}
          </Text>
        </Box>
      }
      placement='right'
      offset={[0, 10]}
      hasArrow
    >
      <Box>
        {item.element === 'a' ? (
          <a href={item.href}>{renderContent()}</a>
        ) : (
          <NavLink href={item.href}>
            {({ isActive }) => renderContent(isActive)}
          </NavLink>
        )}
      </Box>
    </Tooltip>
  );
}
