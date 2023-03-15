import { Flex, FormErrorMessage, Text } from '@chakra-ui/react';
import { faTriangleExclamation } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  inControl?: boolean
}>

export function FormError({ inControl, children }: Props) {
  const content = (
    <Flex alignItems='center' color='red.400'>
      <FontAwesomeIcon
        tabIndex={-1}
        fontSize={14}
        icon={faTriangleExclamation}
      />
      <Text fontSize='xs' ml={1}>{children}</Text>
    </Flex>
  );

  if (inControl) {
    return (
      <FormErrorMessage position='absolute' mt={1}>
        {content}
      </FormErrorMessage>
    )
  }

  return content;
}
