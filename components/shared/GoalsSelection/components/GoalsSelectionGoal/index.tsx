import { GoalDataExtended } from "../../../../pages/Goals/types";
import React from "react";
import { observer } from "mobx-react-lite";
import { chakra, Checkbox, Flex, ListItem } from "@chakra-ui/react";
import { useGoalsSelectionStore } from "../../../../shared/GoalsSelection/store";
import { EmojiSelect } from "../../../../shared/EmojiSelect";
import { EditableTitle } from "../../../../shared/EditableTitle";
import { GoalStateIcon } from "../../../../shared/GoalStateIcon";

type Props = {
    goal: GoalDataExtended;
};

export const GoalsSelectionGoal = observer(function GoalSelectionListItem({ goal }: Props) {
    const store = useGoalsSelectionStore();

    const orderNum = goal.customFields.order + 1;
    const checkboxNumber = orderNum < 10 ? orderNum : null;

    const isChecked = store.isChecked(goal.id);

    const handleGoalCheck = () => {
        store.handleGoalCheck(goal.id);
    };
    const handleToggleTitleFocus = () => {
        store.callbacks?.onToggleTitleFocus?.(goal.id, true);
    };
    const handleToggleTitleBlur = () => {
        store.callbacks?.onToggleTitleFocus?.(goal.id, false);
    };
    const handleTitleUpdate = (title: string) => {
        return store.root.resources.goals.updateProperty?.(goal.id, 'title', title);
    };
    const handleEmojiSelectOpen = (isOpen: boolean) => {
        store.callbacks?.onToggleOpenEmojiPicker?.(goal.id, isOpen);
    };
    const handleColorChange = (color: string) => {
        return store.root.resources.goals.updateProperty?.(goal.id, 'icon.color', color);
    };
    const handleIconChange = (icon: string) => {
        return store.root.resources.goals.updateProperty?.(goal.id, 'icon.value', icon);
    };

    return (
      <ListItem
        h={10}
        display='flex'
        alignItems='center'
        position='relative'
      >
          <Checkbox
            ref={(ref) => store.callbacks?.setRefs?.(goal.customFields.order, ref)}
            isChecked={isChecked}
            onChange={handleGoalCheck}
            size='xl'
            position='relative'
            fontWeight='semibold'
            fontSize='lg'
            icon={checkboxNumber ? <></> : undefined}
            css={{
                '.chakra-checkbox__label': {
                    margin: 0,
                }
            }}
          >
              {checkboxNumber ? (
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
                    {checkboxNumber}
                </chakra.span>
              ) : null}
          </Checkbox>
          <Flex
            alignItems='center'
            flex={1}
            ml={2}
            w='calc(100% - var(--chakra-space-8))'
            cursor='pointer'
            onClick={handleGoalCheck}
          >
              <EmojiSelect
                icon={goal.icon.value}
                color={goal.icon.color}
                disabled={!store.editable}
                size={6}
                iconFontSize='sm'
                cursor='pointer'
                onToggleOpen={handleEmojiSelectOpen}
                onColorChange={handleColorChange}
                onIconChange={handleIconChange}
              />
              <chakra.div ml='2' w='calc(100% - var(--chakra-space-10))'>
                  <EditableTitle
                    widthByTitle
                    value={goal.title}
                    disabled={!store.editable}
                    sharedProps={{ color: 'gray.700', fontWeight: 400, cursor: 'pointer' }}
                    onFocus={handleToggleTitleFocus}
                    onBlur={handleToggleTitleBlur}
                    onSave={handleTitleUpdate}
                  />
              </chakra.div>
          </Flex>

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
});
