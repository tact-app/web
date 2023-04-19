import { observer } from 'mobx-react-lite';
import { GoalDataExtended } from '../../pages/Goals/types';
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
import { GoalStateIcon } from "../../../components/shared/GoalStateIcon";

type GoalSelectionListItemProps = {
  index: number | null;
  goal: GoalDataExtended;
  checkboxContent?: React.ReactNode;
};

const GoalSelectionListItem = observer(
  forwardRef(function GoalSelectionListItem(
    { index, goal, checkboxContent }: GoalSelectionListItemProps,
    ref
  ) {
    const store = useGoalsSelectionStore();

    const isChecked = store.isChecked(goal.id);

    return (
      <ListItem
        h={10}
        display='flex'
        alignItems='center'
        position='relative'
      >
        <Checkbox
          ref={ref}
          isChecked={isChecked}
          onChange={() => store.handleGoalCheck(goal.id)}
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
                icon={goal.icon.value}
                color={goal.icon.color}
                size={6}
                iconFontSize='sm'
                onToggleOpen={(isOpen) => store.callbacks?.onToggleOpenEmojiPicker(goal.id, isOpen)}
                onColorChange={(color) => store.root.resources.goals.updateProperty(goal.id, 'icon.color', color)}
                onIconChange={(icon) => store.root.resources.goals.updateProperty(goal.id, 'icon.value', icon)}
            />
            <chakra.div ml='2' w='calc(100% - var(--chakra-space-10))'>
              <EditableTitle
                  widthByTitle
                  sharedProps={{ color: 'gray.700', fontWeight: 400 }}
                  value={goal.title}
                  onFocus={() => store.callbacks?.onToggleTitleFocus(goal.id, true)}
                  onBlur={() => store.callbacks?.onToggleTitleFocus(goal.id, false)}
                  onSave={(title) => store.root.resources.goals.updateProperty(goal.id, 'title', title)}
              />
            </chakra.div>
          </Flex>
        </Checkbox>

        {goal.customFields.state && (
            <GoalStateIcon
                w={6}
                h={6}
                position='absolute'
                left={-7}
                iconFontSize={18}
                state={goal.customFields.state}
            />
        )}
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
    return store.root.resources.goals.listBySpaces.map(({ space, goals }) => {
      return (
          <Box m={0} p={0} mb={6} _last={{ mb: 0 }} key={space.id}>
            <Flex mb={2} alignItems='center'>
              <EmojiSelect
                icon={space.icon}
                color={space.color}
                title={space.name}
                size={6}
                iconFontSize='sm'
                borderRadius={4}
                onToggleOpen={(isOpen) => store.callbacks?.onToggleOpenEmojiPicker(space.id, isOpen)}
                onColorChange={(color) => store.root.resources.spaces.updateProperty(space.id, 'color', color)}
                onIconChange={(icon) => store.root.resources.spaces.updateProperty(space.id, 'icon', icon)}
                canRemoveEmoji
              />
              <chakra.div ml='2' w='calc(100% - var(--chakra-space-10))'>
                <EditableTitle
                  widthByTitle
                  sharedProps={{ color: 'gray.700', fontWeight: 400 }}
                  value={space.name}
                  onFocus={() => store.callbacks?.onToggleTitleFocus(space.id, true)}
                  onBlur={() => store.callbacks?.onToggleTitleFocus(space.id, false)}
                  onSave={(name) => store.root.resources.spaces.updateProperty(space.id, 'name', name)}
                />
              </chakra.div>
            </Flex>
            <Box m={0} p={0} ml={7}>
              {goals.map((goal) => (
                  <GoalSelectionListItem
                      ref={(el) => props.setRefs(goal.customFields.order, el)}
                      key={goal.id}
                      index={goal.customFields.order}
                      goal={goal}
                      checkboxContent={goal.customFields.order + 1 < 9 ? goal.customFields.order + 1 : null}
                  />
              ))}
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
