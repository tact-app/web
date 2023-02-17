import React, { useRef, useEffect, FC, ReactNode, useState } from 'react';
import { Box } from '@chakra-ui/react';

interface PopoverWrapperProps {
    positionByMouse: boolean;
    children: ReactNode;
    isOpen: boolean;
    left: string;
}

export const PopoverWrapper: FC<PopoverWrapperProps> = ({ positionByMouse, children, isOpen, left }) => {
    const boxRef = useRef<HTMLDivElement>(null)
    const [css, setCss] = useState({})

    useEffect(() => {
        if (positionByMouse && isOpen) {
            const style = window.getComputedStyle(boxRef.current.querySelector('.chakra-popover__popper'));
            const { m41, m42 } = new WebKitCSSMatrix(style.transform);
            const modalXposition = m41 < 0 ? left - window.innerWidth : left

            setCss({
                // TODO:debt find a way to not use !important
                '.chakra-popover__popper': {
                    maxWidth: 288,
                    transform: `translate(${modalXposition}px,${m42}px)!important`
                }
            })
        }
    }, [])

    return (
        <Box
            ref={boxRef}
            __css={{...css}}>
            {children}
        </Box>
    )
}
