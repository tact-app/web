import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Drawer,
  DrawerContent,
  chakra,
  DrawerContentProps,
} from '@chakra-ui/react';

export const ResizableDrawer = observer(function ResizableDrawer({
  isOpen,
  onClose,
  children,
  minWidth = '20%',
  maxWidth = '75%',
  defaultWidth = '35%',
  containerRef,
  ...rest
}: PropsWithChildren<{
  isOpen: boolean;
  onClose?: () => void;
  minWidth?: number | string;
  maxWidth?: number | string;
  defaultWidth?: number | string;
  containerRef?: React.RefObject<HTMLElement>;
}> &
  DrawerContentProps) {
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
    document.body.style.userSelect = 'none';
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
    document.body.style.userSelect = '';
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
    >
      <DrawerContent
        maxWidth={maxWidth}
        style={{
          width: newWidth,
        }}
        {...rest}
      >
        <chakra.div
          onMouseDown={handleMouseDown}
          onDoubleClick={() => setNewWidth(defaultWidth)}
          position='absolute'
          height='100%'
          width={1.5}
          left={-0.75}
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
