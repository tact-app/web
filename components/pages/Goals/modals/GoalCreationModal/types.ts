import { GoalData } from "../../types";
import { DescriptionData } from "../../../../../types/description";
import { TaskData } from "../../../../shared/TasksList/types";

export type GoalCreationModalProps = {
  onClose: () => void;
  onSave: (data: {
    goal: GoalData,
    description?: DescriptionData,
    tasks?: TaskData[],
    order?: string[],
  }) => void;
  editMode?: boolean;
  goal?: GoalData;
};

export enum GoalCreationModalsTypes {
  CLOSE_SUBMIT,
}
