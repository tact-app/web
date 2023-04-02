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

export const GOALS_STATUSES_COLORS = {
  [GoalStatus.TODO]: 'gray.500',
  [GoalStatus.WONT_DO]: 'gray.500',
  [GoalStatus.DONE]: 'blue.400',
};

export const GOALS_STATUSES_COMMANDS = {
  [GoalStatus.TODO]: '⌥T',
  [GoalStatus.WONT_DO]: '⌥W',
  [GoalStatus.DONE]: '⌥D',
};

export const GOALS_STATUSES_HOTKEYS = {
  [GoalStatus.TODO]: 'alt+t',
  [GoalStatus.WONT_DO]: 'alt+w',
  [GoalStatus.DONE]: 'alt+d',
};
