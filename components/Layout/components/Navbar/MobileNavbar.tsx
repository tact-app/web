import { Flex, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { NavItem } from './types';
import NextLink from 'next/link';

export function MobileNavbar({ items, onItemClick }: { onItemClick: () => void, items: Array<NavItem> }) {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {items.map((navItem) => (
        <MobileNavItem key={navItem.label} item={navItem} onClick={onItemClick}/>
      ))}
    </Stack>
  );
}

function MobileNavItem({ item: { href, label }, onClick }: { item: NavItem, onClick: () => void }) {
  return (
    <Stack spacing={4} onClick={onClick}>
      <NextLink href={href}>
        <Flex
          py={2}
          as={Link}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
        </Flex>
      </NextLink>
    </Stack>
  );
}