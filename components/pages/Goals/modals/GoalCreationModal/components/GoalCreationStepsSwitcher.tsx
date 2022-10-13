import { observer } from 'mobx-react-lite';
import { useGoalCreationModalStore } from '../store';
import { GoalCreationModalSteps } from '../types';
import { GoalCreationSelectTemplate } from './GoalCreationSelectTemplate';
import { GoalCreationDescription } from './GoalCreationDescription';

export const GoalCreationStepsSwitcher = observer(function GoalCreationStepsSwitcher() {
  const store = useGoalCreationModalStore();

  switch (store.step) {
    case GoalCreationModalSteps.SELECT_TEMPLATE:
      return <GoalCreationSelectTemplate/>;
    case GoalCreationModalSteps.FILL_DESCRIPTION:
      return <GoalCreationDescription/>;
    default:
      return null;
  }
});
