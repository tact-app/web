import { Box, Link, Stack } from '@chakra-ui/react';
import NavLink from '../../../shared/Link';
import { NavItem } from './types';

export function MainMenu({ items }: { items: NavItem[] }) {
  return (
    <Stack direction='column' p={2}>
      {items.map((navItem) => (
        <Box key={navItem.label}>
          <NavLink href={navItem.href}>
            {({ isActive }) => (
              <Link
                p={1}
                fontWeight={400}
                bg={isActive ? 'gray.300' : 'transparent'}
                borderRadius={4}
                display={'flex'}
                alignItems={'center'}
                _hover={{
                  textDecoration: 'none',
                  bg: isActive ? 'gray.300' : 'gray.200',
                }}
              >
                {navItem.icon}
              </Link>
            )}
          </NavLink>
        </Box>
      ))}
    </Stack>
  );
}
