import { GoalData, GoalDataExtended } from "../../types";

export type GoalListCallbacks = {
  onOpenGoal(goalId: string, goals: Record<string, GoalDataExtended[]>): void;
  onDeleteGoal(goalId: string): Promise<void>;
  onUpdateGoal(goal: GoalDataExtended): void;
  onWontDo(goal: GoalDataExtended): void;
  onCloneGoal?(goal: GoalDataExtended): Promise<GoalData>;
};

export type GoalListProps = GoalListCallbacks & {
  disableHotkeys: boolean;
  listBySpaces: Record<string, GoalDataExtended[]>;
};
