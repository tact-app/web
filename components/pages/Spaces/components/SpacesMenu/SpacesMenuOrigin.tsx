import { observer } from 'mobx-react-lite';
import { OriginChildData } from '../../types';
import { Box, Collapse } from '@chakra-ui/react';
import { useSpacesMenuStore } from './store';
import { useMemo } from 'react';
import { SpacesMenuOriginRow } from './SpacesMenuOriginRow';

export const SpacesMenuOrigin = observer(function SpacesMenuOriginInner({
  item,
  space,
  path = [],
}: {
  item: OriginChildData;
  space: string;
  path?: string[];
}) {
  const store = useSpacesMenuStore();
  const innerPath = useMemo(() => [...path, item.id], [path, item]);
  const state = useMemo(
    () => store.getOriginState(space, innerPath),
    [space, innerPath, store]
  );

  return (
    <Box>
      <SpacesMenuOriginRow
        item={item}
        isExpanded={state.expanded}
        space={space}
        path={innerPath}
      />
      {item.children?.length > 0 ? (
        <Collapse in={state.expanded} animateOpacity>
          <Box pl={6}>
            {item.children.map((child) => (
              <SpacesMenuOrigin
                key={child.id}
                space={space}
                item={child}
                path={innerPath}
              />
            ))}
          </Box>
        </Collapse>
      ) : null}
    </Box>
  );
});
