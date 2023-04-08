import { GoalStatus } from "./types";
import { faCircle } from "@fortawesome/pro-regular-svg-icons";
import { faCircleCheck, faCircleMinus } from "@fortawesome/pro-solid-svg-icons";

export const GOALS_STATUSES_ICONS = {
  [GoalStatus.TODO]: faCircle,
  [GoalStatus.WONT_DO]: faCircleMinus,
  [GoalStatus.DONE]: faCircleCheck,
};

export const GOALS_STATUSES_COLORS = {
  [GoalStatus.TODO]: 'gray.500',
  [GoalStatus.WONT_DO]: 'gray.500',
  [GoalStatus.DONE]: 'blue.400',
};
