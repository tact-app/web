import { useRadioGroup } from "@chakra-ui/radio";
import { HStack, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { FilterCard } from "./components/FilterCard/FilterCard";
import { FilterProps } from "./types";

export function Filters({ options, value, onChange }: FilterProps) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'filter',
    defaultValue: value,
    onChange,
  });

  return (
    <HStack {...getRootProps()}>
      {options.map(({ value, label, icon }) => (
        <FilterCard key={value} {...getRadioProps({ value })}>
          <Flex color='gray.500' alignItems='center'>
            <Flex alignItems='center' justifyContent='center' color='gray.500'>{icon}</Flex>
            <Text fontSize='md' ml={Boolean(icon) ? 2 : 0} lineHeight={6} color='gray.700'>{label}</Text>
          </Flex>
        </FilterCard>
      ))}
    </HStack>
  )
}
