import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalDataExtended, GoalStatus } from "../../types";
import { GoalListCallbacks, GoalListProps } from './types';
import { EDITABLE_TITLE_ID_SLUG } from "../../../../shared/EditableTitle";
import { SpaceData } from "../../../Spaces/types";
import { KeyboardEvent } from 'react';
import { chunk } from 'lodash';

export class GoalListStore {
  listBySpaces: Record<string, GoalDataExtended[]> = {};
  isHotkeysDisabled: boolean;
  callbacks: GoalListCallbacks;

  containerRef: HTMLDivElement | null = null;
  goalsRefs: Record<string, HTMLDivElement> = {};
  focusedGoalId: string | null = null;
  isFocusedGoalEditing: boolean = false;
  isMenuOpenedForFocusedGoal: boolean = false;
  isMenuOpenByContextMenu: boolean = false;
  xPosContextMenu: number;
  isCommandWithAltPressed: boolean = false;

  keyMap = {
    ON_RESET_FOCUSED_GOAL: ['tab', 'shift+tab'],
    ON_NAVIGATE: ['up', 'down', 'left', 'right'],
    START_GOAL_EDITING: ['space'],
    ON_OPEN: ['enter', 'alt+o'],
    ON_DONE: ['alt+d'],
    ON_WONT_DO: ['alt+w'],
    ON_CLONE: ['alt+c'],
    ON_ARCHIVE: ['alt+a'],
    ON_DELETE: ['backspace'],
    QUICK_DELETE: ['meta+backspace'],
  };

  hotkeyHandlers = {
    ON_RESET_FOCUSED_GOAL: (event) => {
      event.preventDefault();
      this.setFocusedGoalId(null);
    },
    ON_NAVIGATE: (event: KeyboardEvent) => {
      event.preventDefault();
      if (!this.focusedGoalId) {
        this.setFirstGoalAsFocused();
      } else if (!this.isFocusedGoalEditing && !this.isMenuOpenedForFocusedGoal) {
        const { currentRowIndex, currentColumnIndex } = this.getCurrentRowColIndexes();

        let nextGoalRowIndex = null;
        let nextGoalColumnIndex = null;

        if (event.key === 'ArrowDown') {
          nextGoalRowIndex = currentRowIndex + 1;
          nextGoalColumnIndex = currentColumnIndex;

          if (this.arrayByColumns[nextGoalRowIndex] && !this.arrayByColumns[nextGoalRowIndex][nextGoalColumnIndex]) {
            nextGoalColumnIndex = 0;
          }
        } else if (event.key === 'ArrowUp') {
          nextGoalRowIndex = currentRowIndex - 1;
          nextGoalColumnIndex = currentColumnIndex;

          if (this.arrayByColumns[nextGoalRowIndex] && !this.arrayByColumns[nextGoalRowIndex][nextGoalColumnIndex]) {
            nextGoalColumnIndex = 0;
          }
        } else if (event.key === 'ArrowRight') {
          nextGoalRowIndex = currentRowIndex;
          nextGoalColumnIndex = currentColumnIndex + 1;

          if (!this.arrayByColumns[nextGoalRowIndex]?.[nextGoalColumnIndex]) {
            nextGoalRowIndex += 1;
            nextGoalColumnIndex = 0;
          }
        } else if (event.key === 'ArrowLeft') {
          nextGoalRowIndex = currentRowIndex;
          nextGoalColumnIndex = currentColumnIndex - 1;

          if (!this.arrayByColumns[nextGoalRowIndex]?.[nextGoalColumnIndex]) {
            nextGoalRowIndex -= 1;
            nextGoalColumnIndex = this.arrayByColumns[nextGoalRowIndex]?.length - 1;
          }
        }

        const nextGoalId = this.arrayByColumns[nextGoalRowIndex]?.[nextGoalColumnIndex];

        if (nextGoalId) {
          this.setFocusedGoalId(nextGoalId);
        }
      }
    },
    START_GOAL_EDITING: (event) => {
      if (!this.focusedGoalId) {
        return;
      }

      event.preventDefault();
      this.isFocusedGoalEditing = true;
      this.getGoalTitleElement(this.focusedGoalId).click();
    },
    ON_OPEN: (event: KeyboardEvent) => {
      event.preventDefault();
      if (this.isGoalFocusedAndNotEditing && (event.key !== 'Enter' || !this.isMenuOpenedForFocusedGoal)) {
        this.isCommandWithAltPressed = true;
        this.callbacks?.onOpenGoal(this.focusedGoalId, this.listBySpaces);
      }
    },
    ON_DONE: (event) => {
      event.preventDefault();
      if (this.isGoalFocusedAndNotEditing) {
        this.isMenuOpenedForFocusedGoal = false;
        this.isCommandWithAltPressed = true;
        this.doneGoal(this.focusedGoal);
      }
    },
    ON_WONT_DO: (event) => {
      event.preventDefault();
      if (this.isGoalFocusedAndNotEditing) {
        this.isMenuOpenedForFocusedGoal = false;
        this.isCommandWithAltPressed = true;
        this.callbacks?.onWontDo(this.focusedGoal);
      }
    },
    ON_CLONE: (event) => {
      event.preventDefault();
      if (this.isGoalFocusedAndNotEditing) {
        this.isMenuOpenedForFocusedGoal = false;
        this.isCommandWithAltPressed = true;
        this.cloneGoal(this.focusedGoal);
      }
    },
    ON_ARCHIVE: (event) => {
      event.preventDefault();
      if (this.isGoalFocusedAndNotEditing) {
        this.isMenuOpenedForFocusedGoal = false;
        this.isCommandWithAltPressed = true;
        this.archiveGoal(this.focusedGoal);
      }
    },
    ON_DELETE: (event) => {
      event.preventDefault();
      if (this.isGoalFocusedAndNotEditing) {
        this.isMenuOpenedForFocusedGoal = false;
        this.isCommandWithAltPressed = true;
        this.handleDeleteGoal(this.focusedGoalId);
      }
    },
    QUICK_DELETE: async (event) => {
      event.preventDefault();
      if (this.isGoalFocusedAndNotEditing) {
        this.isMenuOpenedForFocusedGoal = false;
        await this.deleteGoal(this.focusedGoalId);
      }
    },
  };

  additionalKeyMap = {
    OPEN_GOAL_MENU: ['alt'],
  };

  additionalHotkeyHandlers = {
    OPEN_GOAL_MENU: (e: KeyboardEvent) => {
      e.preventDefault();
      const isAlt = e.key === 'Alt';

      if (!this.isCommandWithAltPressed && this.isGoalFocusedAndNotEditing && isAlt) {
        this.toggleActionMenuForGoal(this.focusedGoalId, !this.isMenuOpenedForFocusedGoal)
      }

      if (isAlt && this.isCommandWithAltPressed) {
        this.isCommandWithAltPressed = false;
      }
    },
  }

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  get isGlobalHotkeysEnabled() {
    return !this.isHotkeysDisabled && !this.root.globalModals.isOpen;
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

  get goalCardsColumnCount() {
    return Math.floor(this.containerRef?.clientWidth / 330);
  }

  get arrayByColumns() {
    return Object.entries(this.listBySpaces).reduce((acc, [spaceId, goals]) => {
      return [
        ...acc,
        ...chunk(goals.map((goal) => goal.id), this.goalCardsColumnCount),
      ];
    }, [] as string[][]);
  }

  getCurrentRowColIndexes = (goalId: string = this.focusedGoalId) => {
    const currentRowIndex = this.arrayByColumns
      .findIndex((row) => row.includes(goalId));
    const currentColumnIndex = this.arrayByColumns[currentRowIndex]
      .findIndex((goalInColId) => goalInColId === goalId);

    return {
      currentColumnIndex,
      currentRowIndex
    };
  }

  handleContainerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isGoalFocusedAndNotEditing && !this.isMenuOpenedForFocusedGoal) {
      e.stopPropagation();
      this.setFocusedGoalId(null);
    }
  }

  setContainerRef = (ref: HTMLDivElement) => {
    this.containerRef = ref;
  };

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

    this.setFocusedGoalId(clonedGoal.id);
    this.getGoalTitleElement(clonedGoal.id).click();
  }

  doneGoal = (goal: GoalDataExtended) => {
    return this.callbacks?.onUpdateGoal({
      ...goal,
      status: goal.status === GoalStatus.DONE ? GoalStatus.TODO : GoalStatus.DONE,
    });
  }

  archiveGoal = async (goal: GoalDataExtended) => {
    const nextGoalToFocus = this.getNextGoalToFocus(goal.id);

    await this.callbacks?.onUpdateGoal({
      ...goal,
      isArchived: !goal.isArchived
    });

    this.setFocusedGoalId(nextGoalToFocus);
  }

  getNextGoalToFocus = (goalId: string) => {
    const { currentRowIndex, currentColumnIndex } = this.getCurrentRowColIndexes(goalId);

    const nextItemInRow = this.arrayByColumns[currentRowIndex]?.[currentColumnIndex + 1];
    const prevItemInRow = this.arrayByColumns[currentRowIndex]?.[currentColumnIndex - 1];
    const nextItemInCol = this.arrayByColumns[currentRowIndex + 1]?.[currentColumnIndex];
    const prevItemInCol = this.arrayByColumns[currentRowIndex - 1]?.[currentColumnIndex];

    return nextItemInRow || prevItemInRow || nextItemInCol || prevItemInCol || this.goalsList[0]?.id;
  };

  deleteGoal = async (goalId: string) => {
    const nextGoalToFocus = this.getNextGoalToFocus(goalId);

    await this.callbacks?.onDeleteGoal(goalId);
    this.setFocusedGoalId(nextGoalToFocus);
  };

  handleDeleteGoal = async (goalId: string) => {
    if (
        await this.root.confirm({
          title: 'Delete goal',
          type: 'delete',
          content: 'Are you sure you would like to delete this goal?'
        })
    ) {
      await this.deleteGoal(goalId);
    }
  }

  getSpace = (spaceId: string) => {
    return toJS(this.root.resources.spaces.getById(spaceId));
  }

  updateSpace = (space: SpaceData) => {
    return this.root.resources.spaces.update(space);
  }

  setFocusedGoalId = (goalId: string | null) => {
    const lastFocusedGoal = this.focusedGoalId;

    this.focusedGoalId = goalId;
    this.isFocusedGoalEditing = false;
    this.isMenuOpenedForFocusedGoal = false;

    if (goalId) {
      this.goalsRefs[goalId].focus();
    } else if (lastFocusedGoal) {
      this.goalsRefs[lastFocusedGoal].blur();
    }
  };

  toggleActionMenuForGoal = (goalId: string | null, isOpen: boolean, xPosContextMenu?: number) => {
    this.isMenuOpenedForFocusedGoal = isOpen;

    if (isOpen) {
      this.focusedGoalId = goalId;
      this.isFocusedGoalEditing = false;
    } else if (document.activeElement === document.body) {
      this.focusedGoalId = null;
      this.isFocusedGoalEditing = false;
    }

    if (isOpen && xPosContextMenu) {
      this.isMenuOpenByContextMenu = true;
      this.xPosContextMenu = xPosContextMenu;
    } else {
      this.isMenuOpenByContextMenu = false;
      this.xPosContextMenu = undefined;
    }
  };

  setEditedGoalId = (goalId: string | null) => {
    this.focusedGoalId = goalId;
    this.isFocusedGoalEditing = true;
  };

  setFirstGoalAsFocused = () => {
    this.setFocusedGoalId(this.goalsList[0]?.id ?? null);
  };

  init = () => {
    if (!this.focusedGoalId && Object.keys(this.goalsRefs).length) {
      this.setFirstGoalAsFocused();
    }
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
  };
}

export const {
  StoreProvider: GoalListStoreProvider,
  useStore: useGoalListStore
} = getProvider(GoalListStore);
