import { Stack, chakra, Tooltip, Box, Text } from '@chakra-ui/react';
import NavLink from '../../../shared/Link';
import { NavItem } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function MainMenu({ items }: { items: NavItem[] }) {
  return (
    <Stack direction='column'>
      {items.map((navItem) => (
        <Tooltip
          key={navItem.label}
          label={
            <Box display='flex' alignItems='center' flexDirection='column'>
              {navItem.label}
              <Text fontSize='xs' color='gray.400'>
                {navItem.hotkey}
              </Text>
            </Box>
          }
          placement='right'
          offset={[0, 20]}
          hasArrow
        >
          <Box>
            <NavLink href={navItem.href}>
              {({ isActive }) => (
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
                  <FontAwesomeIcon
                    fixedWidth
                    icon={navItem.icon}
                    fontSize={20}
                  />
                </chakra.span>
              )}
            </NavLink>
          </Box>
        </Tooltip>
      ))}
    </Stack>
  );
}
