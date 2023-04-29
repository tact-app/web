import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalDataExtended, GoalStatus } from "../../types";
import { GoalListCallbacks, GoalListProps } from './types';
import { EDITABLE_TITLE_ID_SLUG } from "../../../../shared/EditableTitle";
import { SpaceData } from "../../../Spaces/types";
import { KeyboardEvent } from 'react';

export class GoalListStore {
  listBySpaces: Record<string, GoalDataExtended[]> = {};
  isHotkeysDisabled: boolean;
  callbacks: GoalListCallbacks;

  goalsRefs: Record<string, HTMLDivElement> = {};
  focusedGoalId: string | null = null;
  isFocusedGoalEditing: boolean = false;

  keyMap = {
    ON_NAVIGATE: ['up', 'down', 'left', 'right'],
    START_GOAL_EDITING: ['space'],
    ON_OPEN: ['enter', 'alt+o'],
    ON_DONE: ['alt+d'],
    ON_WONT_DO: ['alt+w'],
    ON_CLONE: ['alt+c'],
    ON_ARCHIVE: ['alt+a'],
    ON_DELETE: ['backspace', 'alt+backspace']
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
    ON_OPEN: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.callbacks?.onOpenGoal(this.focusedGoalId);
      }
    },
    ON_DONE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.doneGoal(this.focusedGoal);
      }
    },
    ON_WONT_DO: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.callbacks?.onWontDo(this.focusedGoal);
      }
    },
    ON_CLONE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.callbacks?.onCloneGoal(this.focusedGoal);
      }
    },
    ON_ARCHIVE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.archiveGoal(this.focusedGoal);
      }
    },
    ON_DELETE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.handleDeleteGoal(this.focusedGoalId);
      }
    },
  };

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  get isGoalFocusedAndNotEditing() {
    return this.focusedGoalId && !this.isFocusedGoalEditing;
  }

  get goalsList() {
    return Object.values(this.listBySpaces).flat();
  }

  get hasClone() {
    return Boolean(this.callbacks?.onCloneGoal);
  }

  get focusedGoal() {
    return this.goalsList.find((goal) => goal.id === this.focusedGoalId);
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

  doneGoal = (goal: GoalDataExtended) => {
    return this.callbacks?.onUpdateGoal({
      ...goal,
      status: goal.status === GoalStatus.DONE ? GoalStatus.TODO : GoalStatus.DONE,
    });
  }

  archiveGoal = (goal: GoalDataExtended) => {
    return this.callbacks?.onUpdateGoal({
      ...goal,
      isArchived: !goal.isArchived
    });
  }

  handleDeleteGoal = async (goalId: string) => {
    if (
        await this.root.confirm({
          title: 'Delete goal',
          type: 'delete',
          content: 'Are you sure you would like to delete this goal?'
        })
    ) {
      await this.callbacks?.onDeleteGoal(goalId);
    }
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

  update = ({
    listBySpaces,
    disableHotkeys,
    onUpdateGoal,
    onDeleteGoal,
    onCloneGoal,
    onOpenGoal,
    onWontDo
  }: GoalListProps) => {
    this.listBySpaces = listBySpaces;
    this.isHotkeysDisabled = disableHotkeys;
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
