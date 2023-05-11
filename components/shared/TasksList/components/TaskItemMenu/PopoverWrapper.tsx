import React, { useRef, useEffect, FC, ReactNode, useState } from 'react';
import { Box } from '@chakra-ui/react';

interface PopoverWrapperProps {
    positionByMouse: boolean;
    children: ReactNode;
    left: number;
}

export const PopoverWrapper: FC<PopoverWrapperProps> = ({ positionByMouse, children, left }) => {
    const boxRef = useRef<HTMLDivElement>(null)
    const [css, setCss] = useState({})

    useEffect(() => {
        if (positionByMouse) {
            const style = window.getComputedStyle(boxRef.current.querySelector('.chakra-popover__popper'));
            const { m41 } = new WebKitCSSMatrix(style.transform);
            const absM41 = Math.abs(m41)
            const modalXposition = left - (m41 < 0 ? -m41 : m41)
            const leftOffset = (modalXposition < absM41 && m41 < 0) ? absM41 : modalXposition

            setCss({
                opacity: 1,
                // TODO:debt find a way to not use !important
                '.chakra-popover__popper': {
                    maxWidth: 288,
                    ...(!(left > m41 && m41 > 0 )&& {left: leftOffset + 'px!important'})
                }
            })
        }
        else {
            setCss({
                opacity: 1
            })
        }
    }, [positionByMouse, left])

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
