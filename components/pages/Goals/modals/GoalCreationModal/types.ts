import { GoalData } from "../../types";
import { UpdateOrCreateGoalParams } from "../../../../../stores/RootStore/Resources/GoalsStore";

export type GoalCreationModalProps = {
  onClose: () => void;
  onSave: (data: UpdateOrCreateGoalParams) => Promise<void>;
  editMode?: boolean;
  goal?: GoalData;
};

export enum GoalCreationModalsTypes {
  CLOSE_SUBMIT,
}
