import { observer } from "mobx-react-lite";
import { useGoalsSelectionStore } from "../../store";
import React from "react";
import { Box, chakra, Flex } from "@chakra-ui/react";
import { EmojiSelect } from "../../../EmojiSelect";
import { EditableTitle } from "../../../EditableTitle";
import { GoalsSelectionGoal } from "../GoalsSelectionGoal";
import { GoalDataExtended } from "../../../../pages/Goals/types";
import { SpaceData } from "../../../../pages/Spaces/types";

type Props = {
  space: SpaceData;
  goals: GoalDataExtended[];
};

export const GoalsSelectionSpace = observer(function GoalsSelectionSpace({ space, goals }: Props) {
  const store = useGoalsSelectionStore();

  const handleEmojiSelectOpen = (isOpen: boolean) => {
    store.callbacks?.onToggleOpenEmojiPicker?.(space.id, isOpen);
  };
  const handleColorChange = (color: string) => {
    store.root.resources.spaces.updateProperty(space.id, 'color', color);
  };
  const handleIconChange = (icon: string) => {
    store.root.resources.spaces.updateProperty(space.id, 'icon', icon);
  };
  const handleTitleFocus = () => {
    store.callbacks?.onToggleTitleFocus?.(space.id, true)
  };
  const handleTitleBlur = () => {
    store.callbacks?.onToggleTitleFocus?.(space.id, false)
  };
  const handleNameSave = (name: string) => {
    store.root.resources.spaces.updateProperty(space.id, 'name', name);
  };

  return (
    <Box m={0} p={0} mb={6} _last={{ mb: 0 }}>
      <Flex mb={2} alignItems='center'>
        <EmojiSelect
          icon={space.icon}
          color={space.color}
          title={space.name}
          size={6}
          iconFontSize='sm'
          borderRadius={4}
          onToggleOpen={handleEmojiSelectOpen}
          onColorChange={handleColorChange}
          onIconChange={handleIconChange}
          canRemoveEmoji
        />
        <chakra.div ml='2' w='calc(100% - var(--chakra-space-10))'>
          <EditableTitle
            widthByTitle
            sharedProps={{ color: 'gray.700', fontWeight: 400 }}
            value={space.name}
            onFocus={handleTitleFocus}
            onBlur={handleTitleBlur}
            onSave={handleNameSave}
          />
        </chakra.div>
      </Flex>
      <Box m={0} p={0} ml={7}>
        {goals.map((goal) => <GoalsSelectionGoal key={goal.id} goal={goal} />)}
      </Box>
    </Box>
  );
});
