import { IconButton, chakra } from '@chakra-ui/react';
import { ArrowDownIcon } from '../../../../shared/Icons/ArrowIcons';
import { SyntheticEvent } from 'react';

export const SpacesMenuOriginItemArrow = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: (e: SyntheticEvent) => void;
}) => (
  <IconButton
    size='xs'
    aria-label={'open'}
    onClick={onToggle}
    variant='unstyled'
    pr={4}
  >
    <chakra.div
      transition={'transform 0.2s ease-in-out'}
      transform={isOpen ? 'rotate(180deg)' : 'rotate(0)'}
    >
      <ArrowDownIcon />
    </chakra.div>
  </IconButton>
);
