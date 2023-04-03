import { chakra, Checkbox, FormControl, List, ListItem, Text, Textarea } from "@chakra-ui/react";
import { FormError } from "../FormError";
import React from "react";
import { observer } from "mobx-react-lite";
import { useCheckboxGroupStore } from "./store";
import { CheckboxGroupItem } from "./types";
import { useListNavigation } from "../../../helpers/ListNavigation";

export const CheckboxGroupView = observer(
  function CheckboxGroup() {
    const store = useCheckboxGroupStore();

    useListNavigation(store.navigation);

    const renderItem = (item: CheckboxGroupItem, index: number) => {
      const isChecked = item.value === store.value;
      const number = index + 1;
      const isMaxDisplayIndex = number > 9;

      return (
        <ListItem
          key={item.value || index}
          display='flex'
          alignItems='center'
          mb={3}
        >
          <Checkbox
            ref={(el) => store.navigation.setRefs(index, el)}
            isChecked={isChecked}
            onChange={() => store.handleChange(item)}
            size='xl'
            position='relative'
            fontWeight='semibold'
            fontSize='lg'
            width='100%'
            icon={isMaxDisplayIndex ? undefined : <></>}
          >
            {!isMaxDisplayIndex && (
              <chakra.span
                position='absolute'
                left={0}
                w={6}
                top={0}
                bottom={0}
                display='flex'
                alignItems='center'
                justifyContent='center'
                color={isChecked ? 'white' : 'gray.400'}
              >
                {number}
              </chakra.span>
            )}
            <chakra.span
              display='flex'
              alignItems='center'
              fontSize='sm'
              fontWeight='normal'
            >
              {item.label}
            </chakra.span>
          </Checkbox>
        </ListItem>
      );
    };

    return (
      <FormControl isInvalid={store.isInvalid}>
        <Text fontWeight='bold' fontSize='semibold' mb={4}>
          Chose reason
        </Text>
        <List>{store.items.map(renderItem)}</List>
        <FormError inControl>{store.errorToDisplay}</FormError>
      </FormControl>
    );
  }
);
