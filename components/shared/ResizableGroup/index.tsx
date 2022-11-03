import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';
import useResizeObserver from 'use-resize-observer';

function manageResize(
  e,
  onChange: (prevGrow: number, nextGrow: number) => void,
  onEnd: () => void
) {
  const r = e.target;

  const prev = r.previousElementSibling;
  const next = r.nextElementSibling;
  if (!prev || !next) {
    return;
  }

  e.preventDefault();

  let prevSize = prev.scrollWidth;
  let nextSize = next.scrollWidth;
  const sumSize = prevSize + nextSize;
  const prevGrow = Number(prev.style.flexGrow);
  const nextGrow = Number(next.style.flexGrow);
  const sumGrow = prevGrow + nextGrow;
  let lastPos = e.pageX;

  function onMouseMove(e) {
    let pos = e.pageX;
    const d = pos - lastPos;
    prevSize += d;
    nextSize -= d;

    if (prevSize < 0) {
      nextSize += prevSize;
      pos -= prevSize;
      prevSize = 0;
    }
    if (nextSize < 0) {
      prevSize += nextSize;
      pos += nextSize;
      nextSize = 0;
    }

    const prevGrowNew = sumGrow * (prevSize / sumSize);
    const nextGrowNew = sumGrow * (nextSize / sumSize);

    // prev.style.flexGrow = prevGrowNew;
    // next.style.flexGrow = nextGrowNew;

    onChange(prevGrowNew, nextGrowNew);

    lastPos = pos;
  }

  function onMouseUp(mu) {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    onEnd();
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

export const ResizableGroup = (
  props: PropsWithChildren<{
    configs: {
      size: number;
      flexible?: boolean;
      props?: HTMLChakraProps<'div'>;
    }[];
  }>
) => {
  const { ref, width } = useResizeObserver();
  const [resizingIndex, setIsResizing] = useState<null | number>(null);
  const [widths, setNewWidth] = useState([]);
  const [lastDownX, setLastDownX] = useState(null);
  const animationFrame = useRef(null);
  const fullWidth = width || 0;
  const widthRef = useRef(fullWidth);
  const activeCountRef = useRef(0);
  const activeChildrenSizes = useMemo(() => {
    const children = React.Children.toArray(props.children);

    return props.configs.map((config, i) => (children[i] ? config.size : 0));
  }, [props.children, props.configs]);
  const activeChildrenCount = useMemo(() => {
    return activeChildrenSizes.filter(Boolean).length;
  }, [activeChildrenSizes]);
  const [animations, setAnimations] = useState([]);

  const updateWidths = useCallback(
    (widths) => {
      animationFrame.current = requestAnimationFrame(() => setNewWidth(widths));
    },
    [setNewWidth]
  );

  const totalSize = activeChildrenSizes.reduce((a, b) => a + b, 0);

  useEffect(() => {
    setAnimations((animations) =>
      activeChildrenSizes.map((size, index) => {
        if (size === 0) {
          return 'none';
        } else if (animations[index] === 'none' || !animations[index]) {
          return 'start';
        }

        return animations[index];
      })
    );
  }, [activeChildrenSizes]);

  useEffect(() => {
    if (
      fullWidth &&
      (widths.length === 0 || activeCountRef.current !== activeChildrenCount)
    ) {
      updateWidths(
        activeChildrenSizes.map(
          (childSize) => (fullWidth / totalSize) * childSize
        )
      );
      setAnimations((animations) =>
        animations.map((a, i) => (activeChildrenSizes[i] ? 'start' : 'none'))
      );
    } else if (widthRef.current !== fullWidth) {
      const coef = widthRef.current / fullWidth;
      updateWidths(widths.map((width) => width / coef));
    }
  }, [
    fullWidth,
    activeChildrenSizes,
    totalSize,
    widths,
    activeChildrenCount,
    updateWidths,
  ]);

  const handleMouseDown = useCallback(
    (e, index) => {
      setLastDownX({
        widths: widths,
        pos: e.clientX,
      });
      setIsResizing(index);

      document.body.style.userSelect = 'none';
    },
    [widths]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (resizingIndex === null || !lastDownX) {
        return;
      }

      let offset = e.clientX - lastDownX.pos;

      const newWidths = [...widths];

      newWidths[resizingIndex] = lastDownX.widths[resizingIndex] - offset;

      //const restItems = activeChildrenCount - (resizingIndex + 1);
      const increment = offset / resizingIndex;
      const decrement = offset / (activeChildrenCount - resizingIndex);

      for (let i = 0; i < resizingIndex; i++) {
        newWidths[i] = lastDownX.widths[i] + increment;
      }

      for (let i = resizingIndex; i < newWidths.length; i++) {
        newWidths[i] = lastDownX.widths[i] - decrement;
      }

      updateWidths(newWidths);
    },
    [resizingIndex, lastDownX, activeChildrenCount, widths, updateWidths]
  );

  const handleMouseUp = useCallback((e) => {
    setIsResizing(null);
    setLastDownX(null);

    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingIndex, handleMouseUp, handleMouseMove]);

  useEffect(() => {
    activeCountRef.current = activeChildrenCount;
  }, [activeChildrenCount]);
  useEffect(() => {
    widthRef.current = fullWidth;
  }, [fullWidth]);

  return (
    <chakra.div
      ref={ref}
      display='flex'
      flex={1}
      overflow='hidden'
      width='100%'
    >
      {React.Children.map(props.children, (child, i) => {
        const childWidth = widths[i];
        const animation = animations[i];
        const w =
          animation === 'start'
            ? childWidth + 'px'
            : animation === 'none'
            ? 0
            : childWidth + 'px';

        return child ? (
          <chakra.div
            style={{
              width: w,
            }}
            position='relative'
            onTransitionEnd={() => {
              setAnimations((animations) => {
                const newAnimations = [...animations];
                newAnimations[i] = 'end';
                return newAnimations;
              });
            }}
            transition={
              animations.some((a) => a === 'start') && 'width 0.2s ease-in-out'
            }
            overflow='hidden'
            {...props.configs[i].props}
          >
            {i > 0 && (
              <chakra.div
                onMouseDown={(e) => handleMouseDown(e, i)}
                position='absolute'
                height='100%'
                width={'6px'}
                left={'-3px'}
                _hover={{
                  cursor: 'col-resize',
                  bg: 'gray.100',
                }}
                bg={resizingIndex === i ? 'gray.200' : 'transparent'}
              />
            )}
            <chakra.div
              h='100%'
              style={{
                width:
                  props.configs[i].flexible || animation === 'end'
                    ? 'auto'
                    : childWidth + 'px',
              }}
            >
              {child}
            </chakra.div>
          </chakra.div>
        ) : null;
      })}
    </chakra.div>
  );
};
