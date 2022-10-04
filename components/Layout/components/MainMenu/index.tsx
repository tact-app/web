import {
  Box,
  Link,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';
import NavLink from '../../../shared/Link';
import { NavItem } from './types';
import { Icon } from '@chakra-ui/icons';

export function MainMenu({ items }: { items: NavItem[] }) {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack direction='column'>
      {items.map((navItem) => (
        <Box key={navItem.label} mt={7}>
          <NavLink href={navItem.href}>
            {
              ({ isActive }) => <Link
                p={1}
                fontSize={'md'}
                fontWeight={400}
                color={linkColor}
                bg={isActive ? 'gray.100' : 'transparent'}
                borderRadius={4}
                display={'flex'}
                alignItems={'center'}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                <Icon mr={3} ml={4}>{navItem.icon}</Icon>
                  {navItem.label}
              </Link>
            }
          </NavLink>
        </Box>
      ))}
    </Stack>
  );
}
