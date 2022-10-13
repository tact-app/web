import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Container, Grid, Text } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';

const GoalCreationSelectTemplateButton = observer(function GoalCreationSelectTemplateButton({
                                                                                              title,
                                                                                              icon,
                                                                                              onSelect,
                                                                                            }: {
  title: string,
  icon?: React.ReactNode,
  onSelect: () => void
}) {
  return (
    <Button variant='outline' minH={56} display='flex' flexDirection='column' justifyContent='space-between' p={8}
            onClick={onSelect}>
      <Box>
        {icon ? icon : null}
      </Box>
      <Text fontSize='lg' fontWeight='normal'>{title}</Text>
    </Button>
  );
});

export const GoalCreationSelectTemplate = observer(function GoalCreationSelectTemplate() {
  const store = useGoalCreationModalStore();

  return (
    <Container maxW='2xl'>
      <Grid templateColumns='repeat(3, 1fr)'>
        <GoalCreationSelectTemplateButton title='Empty template' onSelect={() => store.selectTemplate(null)}/>
        {store.templates.map((template) => (
          <GoalCreationSelectTemplateButton
            key={template.id}
            title={template.title}
            icon={template.icon.content}
            onSelect={() => store.selectTemplate(template)}
          />
        ))}
      </Grid>
    </Container>
  );
});
