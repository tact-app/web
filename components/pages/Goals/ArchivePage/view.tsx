import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { GoalList } from '../components/GoalList';
import { ModalsSwitcher } from '../../../../helpers/ModalsController';
import { useGoalsArchiveStore } from './store';
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { faAngleLeft } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export const GoalsArchiveView = observer(function GoalsArchiveView() {
  const { push } = useRouter();
  const store = useGoalsArchiveStore();

  useEffect(() => {
    if (!store.hasGoals) {
      push('/goals');
    }
  }, [store.hasGoals, push]);

  return (
    <>
      <Head>
        <title>Goals Archive</title>
      </Head>
      {store.hasGoals && (
        <>
          <Box pl={32} pr={32} position='relative'>
            <Heading
              size='md'
              fontSize='2xl'
              mt={0}
              mb={0}
              pt={4}
              pb={10}
              textAlign='center'
            >
              Archive
            </Heading>
            <NextLink href='/goals' passHref>
              <Button
                as='a'
                variant='ghost'
                size='sm'
                pl={1.5}
                pr={1.5}
                position='absolute'
                top={4}
                left={32}
                color='gray.500'
              >
                <FontAwesomeIcon
                  fontSize={20}
                  icon={faAngleLeft}
                  fixedWidth
                />
                <Text fontSize='sm' lineHeight={3} fontWeight='normal' ml={1}>
                  Back
                </Text>
              </Button>
            </NextLink>
            <GoalList
              listBySpaces={store.list}
              onDeleteGoal={store.deleteGoal}
              onOpenGoal={store.editGoal}
              onUpdateGoal={store.updateGoal}
              onWontDo={store.wontDoSubmitModalOpen}
            />
          </Box>
          <ModalsSwitcher controller={store.modals} />
        </>
      )}
    </>
  );
});
