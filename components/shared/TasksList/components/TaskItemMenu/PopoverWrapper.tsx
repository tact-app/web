import React, { useRef, useEffect, FC, ReactNode, useState } from 'react';
import { Box } from '@chakra-ui/react';

interface PopoverWrapperProps {
    positionByMouse: boolean;
    children: ReactNode;
    isOpen: boolean;
    left: number;
}

export const PopoverWrapper: FC<PopoverWrapperProps> = ({ positionByMouse, children, isOpen, left }) => {
    const boxRef = useRef<HTMLDivElement>(null)
    const [css, setCss] = useState({})

    useEffect(() => {
        if (positionByMouse && isOpen) {
            const style = window.getComputedStyle(boxRef.current.querySelector('.chakra-popover__popper'));
            const { m41 } = new WebKitCSSMatrix(style.transform);
            const modalXposition = (m41 < 0 ? left - window.innerWidth : left) - m41

            setCss({
                opacity: 1,
                // TODO:debt find a way to not use !important
                '.chakra-popover__popper': {
                    maxWidth: 288,
                    left: modalXposition + 'px!important'
                }
            })
        }
        else {
            setCss({
                opacity: 1
            })
        }
    }, [isOpen, positionByMouse, left])

    return (
        <Box
            ref={boxRef}
            __css={{
                opacity: 0,
                ...css
            }}>
            {children}
        </Box>
    )
}
