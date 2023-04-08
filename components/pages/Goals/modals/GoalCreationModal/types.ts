import { GoalData } from "../../types";
import { UpdateOrCreateGoalParams } from "../../../../../stores/RootStore/Resources/GoalsStore";

export type GoalCreationModalProps = {
  onClose: () => void;
  onSave: (data: UpdateOrCreateGoalParams) => Promise<void>;
  goalId?: string;
  goals?: GoalData[];
};

export enum GoalCreationModalsTypes {
  CLOSE_SUBMIT,
  WONT_DO_SUBMIT
}
