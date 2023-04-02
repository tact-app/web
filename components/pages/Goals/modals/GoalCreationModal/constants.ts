import { GoalStatus } from "../../types";
import { faCircle } from "@fortawesome/pro-regular-svg-icons";
import { faCircleCheck, faCircleMinus } from "@fortawesome/pro-solid-svg-icons";

export const GOALS_STATUSES_TITLES = {
  [GoalStatus.TODO]: 'Todo',
  [GoalStatus.WONT_DO]: 'Won\'t do',
  [GoalStatus.DONE]: 'Done',
};

export const GOALS_STATUSES_ICONS = {
  [GoalStatus.TODO]: faCircle,
  [GoalStatus.WONT_DO]: faCircleMinus,
  [GoalStatus.DONE]: faCircleCheck,
};
