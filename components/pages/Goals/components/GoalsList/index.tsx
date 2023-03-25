import { observer } from 'mobx-react-lite';
import { Box, Heading, Text, Flex, chakra } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { GoalCreateNewButton } from '../GoalCreateNewButton';
import React from 'react';
import { GoalItem } from '../GoalItem';
import ImageComponent from "../../../../shared/Image";
import mascotGoals from '../../../../../assets/images/mascot-goals.png';
import { useHotkeysHandler } from "../../../../../helpers/useHotkeysHandler";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditableTitle } from "../../../../shared/EditableTitle";
import { EmojiSelect } from "../../../../shared/EmojiSelect";
import { GoalDataExtended } from "../../types";

export const GoalsList = observer(function GoalsList() {
  const store = useGoalsStore();

  useHotkeysHandler(store.keymap, store.hotkeysHandlers, {
    enabled: !store.modals.isOpen,
    keyup: true,
  });

  const haveGoals = store.root.resources.goals.haveGoals;

  const renderGoalsBySpaces = (goalsBySpaces: [string, GoalDataExtended[]][]) => {
    return goalsBySpaces.map(([spaceId, goals]) => {
      const space = store.root.resources.spaces.getById(spaceId);

      return (
        <chakra.div key={spaceId}>
          <Flex mb={4} alignItems='center'>
            <EmojiSelect
              icon={space.icon}
              color={space.color + '.100'}
              title={space.name}
              size={8}
              iconFontSize='lg'
              borderRadius={4}
            />
            <EditableTitle
              widthByTitle
              sharedProps={{ color: 'gray.700', ml: 2 }}
              value={space.name}
            />
          </Flex>
          <chakra.div>{goals.map((goal) => <GoalItem key={goal.id} goal={goal} />)}</chakra.div>
        </chakra.div>
      );
    });
  };

  const renderEmptyListMessage = () => (
    <Flex
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      maxW={500}
      margin='auto'
      pt={10}
    >
      <ImageComponent src={mascotGoals} width={336} />
      <Text
        fontSize='sm'
        fontWeight='normal'
        color='gray.700'
        textAlign='center'
        mt={4}
        mb={6}
        lineHeight={5}
      >
        You can define a meaningful destination point that will
        help you focus and&nbsp;complete only essential things that
        bring you closer to it, postponing or&nbsp;canceling the rest.
      </Text>
      <GoalCreateNewButton withHotkey>
        Create new goal 🎯
      </GoalCreateNewButton>
    </Flex>
  );

  return (
    <Box pl={32} pr={32}>
      <Flex
        justifyContent={haveGoals ? 'space-between' : 'center'}
        alignItems='center'
      >
        <Heading size='lg' mt={2.5} mb={8} pt={4}>
          Goals
        </Heading>
        {haveGoals && (
          <GoalCreateNewButton>
            <FontAwesomeIcon icon={faPlus} fontSize={18} />
            <chakra.span ml={3}>New goal</chakra.span>
          </GoalCreateNewButton>
        )}
      </Flex>
      <Box>
        {haveGoals
          ? (
            <Flex flexDirection='column' mb={2}>
              {renderGoalsBySpaces(Object.entries(store.extendedGoals))}
            </Flex>
          ) : renderEmptyListMessage()}
      </Box>
    </Box>
  );
});
