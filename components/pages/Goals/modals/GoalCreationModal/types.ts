import { GoalData } from "../../types";
import { CreateGoalParams } from "../../../../../stores/RootStore/Resources/GoalsStore";

export type GoalCreationModalProps = {
  onClose: () => void;
  onSave: (data: Partial<CreateGoalParams>) => Promise<void>;
  goalId?: string;
  goals?: GoalData[];
};

export enum GoalCreationModalsTypes {
  CLOSE_SUBMIT,
  WONT_DO_SUBMIT
}
