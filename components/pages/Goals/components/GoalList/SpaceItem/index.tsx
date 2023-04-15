import { GoalDataExtended } from "../../../types";
import { chakra, Flex } from "@chakra-ui/react";
import { EmojiSelect } from "../../../../../shared/EmojiSelect";
import { EditableTitle } from "../../../../../shared/EditableTitle";
import { GoalItem } from "../GoalItem";
import React from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { useRootStore } from "../../../../../../stores/RootStore";

type Props = {
  spaceId: string;
  goals: GoalDataExtended[];
};

export const SpaceItem = observer(function SpaceItem({ spaceId, goals }: Props) {
  const store = useRootStore();

  const space = toJS(store.resources.spaces.getById(spaceId));

  const handleSpaceNameChange = (name: string) => {
    return store.resources.spaces.update({ ...space, name });
  };
  const handleSpaceIconChange = (icon: string) => {
    return store.resources.spaces.update({ ...space, icon });
  };
  const handleSpaceColorChange = (color: string) => {
    return store.resources.spaces.update({ ...space, color });
  };

  return (
    <chakra.div key={spaceId}>
      <Flex mb={4} alignItems='center'>
        <EmojiSelect
          icon={space.icon}
          color={space.color}
          title={space.name}
          size={8}
          iconFontSize='lg'
          borderRadius={4}
          onColorChange={handleSpaceColorChange}
          onIconChange={handleSpaceIconChange}
          canRemoveEmoji
        />
        <chakra.div ml='2' w='calc(100% - var(--chakra-space-10))'>
          <EditableTitle
            widthByTitle
            sharedProps={{ color: 'gray.700', fontWeight: 400 }}
            value={space.name}
            onSave={handleSpaceNameChange}
          />
        </chakra.div>
      </Flex>
      <chakra.div>{goals.map((goal) => <GoalItem key={goal.id} goal={goal} />)}</chakra.div>
    </chakra.div>
  );
});
