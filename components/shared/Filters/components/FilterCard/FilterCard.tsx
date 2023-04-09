import { useRadio, useRadioGroup } from "@chakra-ui/radio";
import { Box } from "@chakra-ui/react";
import React from "react";

type Props = ReturnType<ReturnType<typeof useRadioGroup>['getRadioProps']>;

export function FilterCard(props: Props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderRadius={6}
        bg='gray.75'
        _checked={{
          bg: 'gray.200',
        }}
        px={5}
        py={1}
      >
        {props.children}
      </Box>
    </Box>
  )
}
