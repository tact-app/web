import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalDataExtended } from "../../types";
import { GoalListProps, GoalListCallbacks } from './types';
import { EDITABLE_TITLE_ID_SLUG } from "../../../../shared/EditableTitle";
import { SpaceData } from "../../../Spaces/types";
import { KeyboardEvent } from 'react';

export class GoalListStore {
  listBySpaces: Record<string, GoalDataExtended[]> = {};
  callbacks: GoalListCallbacks;

  goalsRefs: Record<string, HTMLDivElement> = {};
  focusedGoalId: string | null = null;
  isFocusedGoalEditing: boolean = false;

  keyMap = {
    ON_NAVIGATE: ['up', 'down', 'left', 'right'],
    START_GOAL_EDITING: ['space'],
    ON_SAVE: ['enter'],
  };

  hotkeyHandlers = {
    ON_NAVIGATE: (event: KeyboardEvent) => {
      if (!this.focusedGoalId) {
        this.setFirstGoalAsFocused();
      } else {
        if (['ArrowLeft', 'ArrowRight'].includes(event.key) && this.goalsList.length) {
          const currentGoalIndex = this.goalsList.findIndex((goal) => goal.id === this.focusedGoalId);

          let goalIndexToFocus = 0;

          if (event.key === 'ArrowLeft') {
            goalIndexToFocus = currentGoalIndex > 0
                ? currentGoalIndex - 1
                : this.goalsList.length - 1;
          } else if (event.key === 'ArrowRight') {
            goalIndexToFocus = currentGoalIndex < this.goalsList.length - 1
                ? currentGoalIndex + 1
                : 0;
          }

          this.setFocusedGoalId(this.goalsList[goalIndexToFocus].id);
        }
      }
    },
    START_GOAL_EDITING: () => {
      if (!this.focusedGoalId) {
        return;
      }

      this.isFocusedGoalEditing = true;
      this.getGoalTitleElement(this.focusedGoalId).click();
    },
    ON_SAVE: () => {
      if (!this.focusedGoalId || this.isFocusedGoalEditing) {
        return;
      }

      this.callbacks?.onOpenGoal(this.focusedGoalId);
    }
  };

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  get goalsList() {
    return Object.values(this.listBySpaces).flat();
  }

  get hasClone() {
    return Boolean(this.callbacks?.onCloneGoal);
  }

  setGoalRef = (goalId: string, ref: HTMLDivElement) => {
    this.goalsRefs[goalId] = ref;
  }

  getGoalTitleElement = (goalId: string) => {
    return this.goalsRefs[goalId].querySelector(
      `#${EDITABLE_TITLE_ID_SLUG}-${goalId}`
    ) as HTMLParagraphElement;
  };

  cloneGoal = async (goal: GoalDataExtended) => {
    if (!this.hasClone) {
      return;
    }

    const clonedGoal = await this.callbacks.onCloneGoal(goal);
    this.getGoalTitleElement(clonedGoal.id).click();
  }

  getSpace = (spaceId: string) => {
    return toJS(this.root.resources.spaces.getById(spaceId));
  }

  updateSpace = (space: SpaceData) => {
    return this.root.resources.spaces.update(space);
  }

  setFocusedGoalId = (goalId: string | null) => {
    this.focusedGoalId = goalId;

    if (goalId) {
      this.goalsRefs[goalId].focus();
    }
  };

  setFirstGoalAsFocused = () => {
    this.setFocusedGoalId(this.goalsList[0].id);
  };

  update = ({ listBySpaces, onUpdateGoal, onDeleteGoal, onCloneGoal, onOpenGoal, onWontDo }: GoalListProps) => {
    this.listBySpaces = listBySpaces;
    this.callbacks = {
      onCloneGoal,
      onDeleteGoal,
      onUpdateGoal,
      onOpenGoal,
      onWontDo,
    };

    if (!this.focusedGoalId && Object.keys(this.goalsRefs).length) {
      this.setFirstGoalAsFocused();
    }
  };
}

export const {
  StoreProvider: GoalListStoreProvider,
  useStore: useGoalListStore
} = getProvider(GoalListStore);
