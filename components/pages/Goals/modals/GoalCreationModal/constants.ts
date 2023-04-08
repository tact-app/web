import { GoalStatus } from "../../types";

export const GOALS_STATUSES_TITLES = {
  [GoalStatus.TODO]: 'Todo',
  [GoalStatus.WONT_DO]: 'Won\'t do',
  [GoalStatus.DONE]: 'Done',
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
