import { Button, Tag, IconButton, ButtonProps } from "@chakra-ui/react";
import { faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";

interface TactTaskTagProps {
    buttonProps?: ButtonProps;
    iconButtonProps?: ButtonProps;
    tagProps?: ButtonProps;
    showRemoveIcon?: boolean;
    title: string;
}

export const TactTaskTag: FC<TactTaskTagProps> = ({
    buttonProps,
    iconButtonProps,
    tagProps,
    title,
    showRemoveIcon = false }) => (
    <Button
        key={title}
        variant='unstyled'
        size='xs'
        fontSize='initial'
        verticalAlign='initial'
        mr={2}
        _hover={{
            button: {
                opacity: 100
            },
            span: {
                bg: 'var(--chakra-colors-blue-600)'
            }
        }}
        _focus={{
            boxShadow: 'none',
            span: {
                boxShadow: 'inset 0px 0px 0px 2px var(--chakra-colors-blue-600)'
            }
        }}
        {...buttonProps}
    >
        <Tag
            bg='blue.400'
            color='white'
            cursor='pointer'
            boxSizing='border-box'
            {...tagProps}
        >
            {title}
        </Tag>
        {showRemoveIcon && (
            <IconButton
                variant='unstyled'
                aria-label='Remove'
                w='12px'
                h='12px'
                minW='12px'
                top='-4px'
                right='-4px'
                position='absolute'
                backgroundColor='var(--chakra-colors-blue-300)'
                opacity='0'
                display='flex'
                alignItems='center'
                justifyContent='center'
                tabIndex={-1}
                isRound
                {...iconButtonProps}
            >
                <FontAwesomeIcon
                    icon={faXmark}
                    fontSize={10}
                    color='var(--chakra-colors-white)'
                />
            </IconButton>
        )}
    </Button>
)
