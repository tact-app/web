import { Button, chakra, forwardRef } from "@chakra-ui/react";
import React, { PropsWithChildren, useCallback } from "react";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActionMenuStore } from "../store";

type Props = PropsWithChildren<{
  command?: string;
  icon: IconDefinition;
  iconFontSize?: number;
  iconColor?: string;
  onClick(): void;
}>;

export const ActionMenuItem = forwardRef(
  (
    {
      onClick,
      command,
      icon,
      iconFontSize,
      iconColor = 'gray.400',
      children,
    }: Props,
    ref
  ) => {
    const store = useActionMenuStore();

    const handleClick = useCallback(() => {
      store.closeMenu();
      onClick();
    }, [store, onClick]);

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        display='flex'
        justifyContent='space-between'
        variant='unstyled'
        borderRadius='none'
        _hover={{ bg: 'gray.100' }}
        _focus={{ outline: 'none', bg: 'gray.100', boxShadow: 'none' }}
        w='100%'
        pr={4}
        pl={4}
      >
        <chakra.span fontWeight='normal'>
          <chakra.span color={iconColor} mr={2}>
            <FontAwesomeIcon icon={icon} fontSize={iconFontSize} fixedWidth />
          </chakra.span>
          {children}
        </chakra.span>
        <chakra.span color='gray.400' fontWeight='normal'>
          {command}
        </chakra.span>
      </Button>
    );
  }
);
