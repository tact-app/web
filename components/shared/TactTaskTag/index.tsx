import { Button, Tag, IconButton, ButtonProps } from "@chakra-ui/react";
import { faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef } from "react";

interface TactTaskTagProps {
    buttonProps?: ButtonProps;
    iconButtonProps?: ButtonProps;
    tagProps?: ButtonProps;
    showRemoveIcon?: boolean;
    title: string;
    selected?: boolean;
}

const TactTaskTag = forwardRef<HTMLButtonElement, TactTaskTagProps>(({
    buttonProps,
    iconButtonProps,
    tagProps,
    title,
    showRemoveIcon = false,
    selected = false,
}, ref) => (
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
                bg: `var(--chakra-colors-blue-${selected ? 600 : 400})`
            }
        }}
        _focus={{
            boxShadow: 'none',
            span: {
                boxShadow: `inset 0px 0px 0px 3px var(--chakra-colors-blue-${selected ? 300 : 600})`
            }
        }}
        ref={ref}
        {...buttonProps}
    >
        <Tag
            bg={`blue.${selected ? 500 : 300}`}
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
));

TactTaskTag.displayName = 'TactTaskTag';

export {TactTaskTag};
