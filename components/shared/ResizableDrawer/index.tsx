import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Drawer, DrawerContent, DrawerProps, chakra } from '@chakra-ui/react';

export const ResizableDrawer = observer(function ResizableDrawer({
  isOpen,
  onClose,
  children,
  minWidth = 300,
  maxWidth = '50%',
  defaultWidth = 400,
  containerRef,
  ...rest
}: {
  isOpen: boolean;
  onClose: () => void;
  minWidth?: number | string;
  maxWidth?: number | string;
  defaultWidth?: number | string;
  containerRef?: React.RefObject<HTMLElement>;
} & DrawerProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [lastDownX, setLastDownX] = useState(0);
  const [newWidth, setNewWidth] = useState(defaultWidth);

  const containerWidth =
    containerRef?.current?.clientWidth || window.innerWidth;
  const minWidthPx =
    typeof minWidth === 'number'
      ? minWidth
      : (containerWidth * parseInt(minWidth)) / 100;
  const maxWidthPx =
    typeof maxWidth === 'number'
      ? maxWidth
      : (containerWidth * parseInt(maxWidth)) / 100;

  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    setLastDownX(e.clientX);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) {
        return;
      }

      let offsetRight =
        document.body.offsetWidth - (e.clientX - document.body.offsetLeft);

      setNewWidth(Math.min(Math.max(offsetRight, minWidthPx), maxWidthPx));
    },
    [isResizing, minWidthPx, maxWidthPx]
  );

  const handleMouseUp = useCallback((e) => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseUp, handleMouseMove]);

  return (
    <Drawer
      variant='aside'
      isOpen={isOpen}
      onClose={onClose}
      trapFocus={false}
      blockScrollOnMount={false}
      {...rest}
    >
      <DrawerContent
        maxWidth={maxWidth}
        style={{
          width: newWidth,
        }}
      >
        <chakra.div
          onMouseDown={handleMouseDown}
          onDoubleClick={() => setNewWidth(defaultWidth)}
          position='absolute'
          height='100%'
          width={1}
          left={-1}
          _hover={{
            cursor: 'col-resize',
            bg: 'gray.100',
          }}
          bg={isResizing ? 'gray.200' : 'transparent'}
        />
        {children}
      </DrawerContent>
    </Drawer>
  );
});
