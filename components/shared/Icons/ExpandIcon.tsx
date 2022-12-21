import { Box } from '@chakra-ui/react';

export const ExpandIcon = ({ left }: { left?: boolean }) => (
  <Box transform={left ? 'rotate(180deg)' : ''}>
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M7 6L12.6464 11.6464C12.8417 11.8417 12.8417 12.1583 12.6464 12.3536L7 18'
        stroke='#A0AEC0'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M12 6L17.6464 11.6464C17.8417 11.8417 17.8417 12.1583 17.6464 12.3536L12 18'
        stroke='#A0AEC0'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  </Box>
);
