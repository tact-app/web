import { observer } from 'mobx-react-lite';
import { GoalIconData } from '../../pages/Goals/types';
import {
  chakra,
  Box,
  Checkbox,
  List,
  ListItem,
  Button,
  forwardRef,
  Flex,
} from '@chakra-ui/react';
import { GoalsSelectionProps, useGoalsSelectionStore } from './store';
import React, { useRef } from 'react';
import { LargePlusIcon } from '../Icons/LargePlusIcon';
import { EmojiSelect } from "../../../components/shared/EmojiSelect";
import { EditableTitle } from "../../../components/shared/EditableTitle";

type GoalSelectionListItemProps = {
  id: string | null;
  index: number | null;
  title: string;
  icon?: GoalIconData;
  checkboxContent?: React.ReactNode;
};

const GoalSelectionListItem = observer(
  forwardRef(function GoalSelectionListItem(
    { id, index, icon, title, checkboxContent }: GoalSelectionListItemProps,
    ref
  ) {
    const store = useGoalsSelectionStore();

    const isChecked = store.isChecked(id);

    return (
      <ListItem
        h={10}
        display='flex'
        alignItems='center'
        key={id}
      >
        <Checkbox
          ref={ref}
          isChecked={isChecked}
          onChange={() => store.handleGoalCheck(id)}
          size='xl'
          position='relative'
          fontWeight='semibold'
          fontSize='lg'
          width='100%'
          icon={checkboxContent ? <></> : undefined}
          css={{
            '.chakra-checkbox__label': {
              width: 'calc(100% - 2rem)',
            }
          }}
        >
          {checkboxContent ? (
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
              {checkboxContent}
            </chakra.span>
          ) : null}
          <Flex alignItems='center'>
            <EmojiSelect
                icon={icon.value}
                color={icon.color}
                size={6}
                iconFontSize='sm'
                onColorChange={() => null}
                onIconChange={() => null}
            />
            <chakra.div ml='2' w='calc(100% - var(--chakra-space-10))'>
              <EditableTitle
                  widthByTitle
                  sharedProps={{ color: 'gray.700', fontWeight: 400 }}
                  value={title}
                  onSave={() => null}
              />
            </chakra.div>
          </Flex>
        </Checkbox>
      </ListItem>
    );
  })
);

export const GoalsSelectionView = observer(function GoalsSelectionView(
  props: Partial<GoalsSelectionProps>
) {
  const store = useGoalsSelectionStore();
  const ref = useRef();

  const renderSpacesAndGoals = () => {
    let lastIndex = 0;

    return store.root.resources.goals.listBySpaces.map(({ space, goals }) => {
      return (
          <Box m={0} p={0} mb={6} key={space.id}>
            <Flex mb={2} alignItems='center'>
              <EmojiSelect
                icon={space.icon}
                color={space.color}
                title={space.name}
                size={6}
                iconFontSize='sm'
                borderRadius={4}
                onColorChange={() => null}
                onIconChange={() => null}
                canRemoveEmoji
              />
              <chakra.div ml='2' w='calc(100% - var(--chakra-space-10))'>
                <EditableTitle
                  widthByTitle
                  sharedProps={{ color: 'gray.700', fontWeight: 400 }}
                  value={space.name}
                  onSave={() => null}
                />
              </chakra.div>
            </Flex>
            <Box m={0} p={0} ml={7}>
              {goals.map((goal) => {
                lastIndex++;
                const currentIndex = lastIndex - 1;

                return (
                  <GoalSelectionListItem
                    ref={(el) => props.setRefs(currentIndex, el)}
                    key={goal.id}
                    id={goal.id}
                    index={currentIndex}
                    title={goal.title}
                    icon={goal.icon}
                    checkboxContent={lastIndex < 9 ? lastIndex : null}
                  />
                );
              })}
            </Box>
          </Box>
      );
    });
  };

  return store.root.resources.goals.count ? (
    <List ref={ref} h='100%' overflowY='auto' pl={1} pr={1}>
      {renderSpacesAndGoals()}
    </List>
  ) : (
    <Box ref={ref}>
      <Button
        ref={(el) => props.setRefs(0, el)}
        h={36}
        w='100%'
        p={6}
        fontSize='lg'
        fontWeight='semibold'
        color='gray.400'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        onClick={store.callbacks.onGoalCreateClick}
        _focus={{
          boxShadow: 'var(--chakra-shadows-outline)',
        }}
      >
        <LargePlusIcon />
        New goal
      </Button>
    </Box>
  );
});
