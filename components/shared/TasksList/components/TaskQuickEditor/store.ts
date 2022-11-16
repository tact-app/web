import type { KeyboardEvent } from 'react';
import { SyntheticEvent } from 'react';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import {
  NavigationDirections,
  TaskData,
  TaskStatus,
  TaskTag,
} from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { TaskQuickEditorSuggestionsMenu } from './suggestionsMenuStore';
import { SpaceData } from '../../../../pages/Spaces/types';
import { PriorityModeStore } from './modes/PriorityModeStore';
import { TagModeStore } from './modes/TagModeStore';
import { SpaceModeStore } from './modes/SpaceModeStore';
import { SUGGESTIONS_MENU_ID } from './TaskQuickEditorMenu';
import { TAGS_ID } from './TaskQuickEditorTags';
import { GoalModeStore } from './modes/GoalModeStore';
import { GoalData } from '../../../../pages/Goals/types';

export type TaskQuickEditorProps = {
  callbacks: {
    onSave?: (task: TaskData) => void;
    onFocus?: () => void;
    onSuggestionsMenuOpen?: (isOpen: boolean) => void;
    onTagCreate?: (tag: TaskTag) => void;
    onNavigate?: (direction: NavigationDirections) => boolean;
    onModeNavigate?: (mode: Modes, direction: NavigationDirections) => boolean;
  };
  tagsMap: Record<string, TaskTag>;
  spaces: SpaceData[];
  order?: Modes[];
  goals: GoalData[];
  listId?: string;
  keepFocus?: boolean;
  task?: TaskData;
};

export enum Modes {
  DEFAULT = 'default',
  PRIORITY = 'priority',
  TAG = 'tag',
  SPACE = 'space',
  GOAL = 'goal',
}

const castArrowToDirection = (key: string): NavigationDirections => {
  switch (key) {
    case 'ArrowDown':
      return NavigationDirections.DOWN;
    case 'ArrowUp':
      return NavigationDirections.UP;
    case 'ArrowLeft':
      return NavigationDirections.LEFT;
    case 'ArrowRight':
      return NavigationDirections.RIGHT;
  }
};

export class TaskQuickEditorStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  suggestionsMenu = new TaskQuickEditorSuggestionsMenu({
    onSelect: (index: number) => this.handleSuggestionSelect(index),
    onOpen: (isOpen: boolean) => this.callbacks.onSuggestionsMenuOpen?.(isOpen),
  });

  order = [Modes.TAG, Modes.PRIORITY, Modes.GOAL, Modes.SPACE];
  callbacks: TaskQuickEditorProps['callbacks'];

  modes = {
    [Modes.PRIORITY]: new PriorityModeStore({
      onExit: () => this.exitMode(),
      onChangeSuggestionIndex: (index: number) =>
        this.suggestionsMenu.setIndex(index),
    }),
    [Modes.TAG]: new TagModeStore({
      onExit: () => this.exitMode(),
      onFocusLeave: (direction: NavigationDirections) => {
        if (direction === NavigationDirections.LEFT) {
          this.focusPrevFilledMode();
        } else if (direction === NavigationDirections.RIGHT) {
          this.focusNextFilledMode();
        }
      },
      onTagCreate: (tag: TaskTag) => this.callbacks.onTagCreate?.(tag),
    }),
    [Modes.SPACE]: new SpaceModeStore({
      onExit: () => this.exitMode(),
    }),
    [Modes.GOAL]: new GoalModeStore({
      onExit: () => this.exitMode(),
    }),
  };

  modeStartPos = 0;
  modeEndPos = 0;
  activeModeType: Modes = Modes.DEFAULT;
  focusedMode: Modes | null = null;

  isMenuOpen: boolean = false;
  keepFocus: boolean = false;

  task: TaskQuickEditorProps['task'] = null;
  listId: string;
  value: string = '';
  focused: boolean = false;
  input: HTMLInputElement | null = null;

  savedCaretPosition: number = 0;

  get isModeActive() {
    return this.activeModeType !== Modes.DEFAULT;
  }

  get activeMode() {
    return this.modes[this.activeModeType];
  }

  get filledModes() {
    return Object.entries(this.modes)
      .filter(([, mode]) => mode.isFilled)
      .map(([name]) => name) as Modes[];
  }

  get isFilled() {
    return this.filledModes.length > 0;
  }

  get orderedFilledModes() {
    return this.order.filter((mode) => this.filledModes.includes(mode));
  }

  getMatchMode = (symbol: string): Modes => {
    const matchMode = Object.entries(this.modes).find(
      ([key, mode]) => mode.startSymbol === symbol
    );

    return matchMode ? (matchMode[0] as Modes) : null;
  };

  resetModes = () => {
    Object.values(this.modes).forEach((mode) => mode.reset());
  };

  activateMode = (modeType: Modes) => {
    this.activeModeType = modeType;
    this.activeMode.activate();
    this.suggestionsMenu.open();

    this.modeStartPos = this.value.length;
    this.modeEndPos = this.value.length + 1;
    this.value += this.modes[modeType].startSymbol;
    this.input?.focus();
  };

  enterMode = (modeType: Modes, e: KeyboardEvent<HTMLInputElement>) => {
    this.activeModeType = modeType;
    this.activeMode.activate();
    this.suggestionsMenu.open();

    this.modeStartPos = (e.target as HTMLInputElement).selectionStart;
    this.modeEndPos = this.modeStartPos;
  };

  exitMode = (silent?: boolean) => {
    this.activeModeType = Modes.DEFAULT;
    this.suggestionsMenu.close();

    if (!silent) {
      this.value =
        this.value.slice(0, this.modeStartPos) +
        this.value.slice(this.modeEndPos);

      this.savedCaretPosition = this.modeStartPos;

      setTimeout(() =>
        this.input.setSelectionRange(
          this.savedCaretPosition,
          this.savedCaretPosition
        )
      );
    }
  };

  openMenu = () => {
    this.focused = true;
    this.isMenuOpen = true;
  };

  closeMenu = () => {
    this.isMenuOpen = false;
  };

  inputRef = (input: HTMLInputElement) => {
    this.input = input;
  };

  setFocus = (focusInput?: boolean) => {
    this.focused = true;

    if (this.isModeActive) {
      this.suggestionsMenu.open();
    }

    if (focusInput) {
      setTimeout(() => {
        if (this.input) {
          this.input.focus();
          this.input.setSelectionRange(
            this.savedCaretPosition,
            this.savedCaretPosition
          );
        }
      });
    }
  };

  removeFocus = () => {
    this.focused = false;
    this.input?.blur();

    this.closeMenu();
    this.suggestionsMenu.close();
    this.suggestionsMenu.closeForMode();
  };

  handleClickOutside = (e: Event) => {
    let currentElem = e.target as HTMLElement;

    if (this.focused) {
      while (currentElem) {
        const attr = currentElem.getAttribute('data-id');

        if (attr === SUGGESTIONS_MENU_ID || attr === TAGS_ID) {
          return;
        }

        currentElem = currentElem.parentElement;
      }

      this.leave();
    } else {
      this.suggestionsMenu.close();
      this.suggestionsMenu.closeForMode();
    }
  };

  leave = () => {
    this.removeFocus();

    if (!this.keepFocus) {
      this.saveTask();
    }
  };

  handleSelect = (e: SyntheticEvent) => {
    this.savedCaretPosition = (e.target as HTMLInputElement).selectionStart;
  };

  removeInputFocus = () => {
    this.input.blur();

    if (!this.keepFocus) {
      this.leave();
    }
  };

  focusMode = (mode: Modes, corner: 'first' | 'last') => {
    this.modes[mode].focus(corner);
  };

  focusFirstFilledMode = () => {
    const filledModes = this.orderedFilledModes;

    if (filledModes.length) {
      this.focusMode(filledModes[0], 'first');
    }
  };

  focusNextFilledMode = () => {
    const filledModes = this.orderedFilledModes;
    const orderIndex = filledModes.indexOf(this.focusedMode);

    if (
      filledModes.length &&
      orderIndex !== -1 &&
      orderIndex < filledModes.length - 1
    ) {
      this.focusMode(filledModes[orderIndex + 1], 'first');

      return true;
    }

    return false;
  };

  focusPrevFilledMode = () => {
    const filledModes = this.orderedFilledModes;
    const orderIndex = filledModes.indexOf(this.focusedMode);

    if (filledModes.length && orderIndex !== -1 && orderIndex > 0) {
      this.focusMode(filledModes[orderIndex - 1], 'last');

      return true;
    } else {
      this.setFocus(true);
    }

    return false;
  };

  saveTask = () => {
    if (this.callbacks.onSave && this.value) {
      this.callbacks.onSave({
        title: this.value,
        id: this.task ? this.task.id : uuidv4(),
        listId: this.listId,
        tags: this.modes.tag.tags.map(({ id }) => id),
        status: TaskStatus.TODO,
        priority: this.modes.priority.priority,
        spaceId: this.modes.space.selectedSpaceId || undefined,
        goalId: this.modes.goal.selectedGoalId || undefined,
      });

      if (this.keepFocus) {
        this.focused = true;
        this.value = '';
        this.resetModes();
      } else if (this.focused) {
        this.removeFocus();
      }
    }
  };

  handleFocus = () => {
    this.setFocus();
    this.focusedMode = null;
    this.callbacks.onFocus?.();
  };

  handleSuggestionSelect = (index: number) => {
    if (this.activeModeType !== Modes.DEFAULT) {
      this.activeMode.handleSuggestionSelect(index);
      this.suggestionsMenu.close();
      this.setFocus(true);
    } else if (this.suggestionsMenu.openForMode !== Modes.DEFAULT) {
      this.modes[this.suggestionsMenu.openForMode].handleSuggestionSelect(
        index
      );
      this.suggestionsMenu.closeForMode();

      if (this.focused) {
        this.setFocus(true);
      }
    }
  };

  handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;

    if (this.isModeActive) {
      const { activeMode } = this;
      const currentPos = target.selectionStart - 1;

      if (currentPos >= this.modeStartPos && currentPos <= this.modeEndPos) {
        this.modeEndPos = target.selectionStart;
        const modeValue = value.slice(this.modeStartPos, this.modeEndPos);

        const shouldExit =
          activeMode.exitSymbol &&
          activeMode.exitSymbol.test(modeValue.slice(-1));

        if (!shouldExit) {
          activeMode.handleInput(modeValue);
        } else {
          this.exitMode();
        }
      } else {
        this.exitMode();
      }
    }

    this.value = value;
  };

  handleModeFocus = (mode: Modes) => () => {
    this.focusedMode = mode;
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!this.isModeActive) {
      this.handleKeyDownInStdMode(e);
    } else {
      this.activeMode.handleKeyDown?.(e);
      this.handleKeyDownWithActiveMode(e);
    }
  };

  handleSuggestionMenuNavigation = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.next();

      return true;
    } else if (e.key === 'ArrowUp') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.prev();

      return true;
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.commit();

      return true;
    }

    return false;
  };

  handleKeyDownWithModeMenu =
    (modeType: Modes) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === 'Enter' &&
        this.suggestionsMenu.openForMode === Modes.DEFAULT
      ) {
        e.stopPropagation();
        e.preventDefault();

        this.suggestionsMenu.openFor(modeType);

        return true;
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();

        if (this.suggestionsMenu.openForMode !== Modes.DEFAULT) {
          this.suggestionsMenu.closeForMode();
        } else {
          this.setFocus(true);
        }

        return true;
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        e.stopPropagation();
        this.modes[modeType].reset();
        this.setFocus(true);
        return true;
      } else if (
        this.suggestionsMenu.openForMode === Modes.DEFAULT &&
        (e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight')
      ) {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'ArrowRight' && this.focusNextFilledMode()) {
          return true;
        } else if (e.key === 'ArrowLeft' && this.focusPrevFilledMode()) {
          return true;
        } else if (
          this.callbacks.onModeNavigate?.(modeType, castArrowToDirection(e.key))
        ) {
          return true;
        } else {
          this.setFocus(true);
          return true;
        }
      }

      return this.handleSuggestionMenuNavigation(e);
    };

  handleKeyDownWithActiveMode = (e: KeyboardEvent<HTMLInputElement>) => {
    if (this.handleSuggestionMenuNavigation(e)) {
      return true;
    }

    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      this.exitMode(true);

      return true;
    } else if (e.key === 'Backspace' && this.activeMode.strValue.length === 1) {
      e.preventDefault();
      this.activeMode.disable();
      return true;
    }

    return false;
  };

  handleKeyDownInStdMode = (e: KeyboardEvent<HTMLInputElement>) => {
    const mode = this.getMatchMode(e.key);

    if (e.key === 'Escape') {
      if (this.callbacks.onNavigate?.(NavigationDirections.INVARIANT)) {
        this.leave();
      }
    } else if (e.key === 'Enter') {
      this.saveTask();
    } else if (mode) {
      this.enterMode(mode, e);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();

      if (this.callbacks.onNavigate?.(castArrowToDirection(e.key))) {
        this.leave();
      }
    } else if (
      e.key === 'ArrowRight' &&
      (e.target as HTMLInputElement).selectionEnd === this.value.length &&
      this.input.selectionStart === this.input.selectionEnd
    ) {
      e.preventDefault();
      this.focusFirstFilledMode();
    }
  };

  reset = () => {
    this.value = '';
    this.resetModes();
    this.activeModeType = Modes.DEFAULT;
  };

  update = ({
    callbacks,
    listId,
    task,
    tagsMap,
    order,
    spaces,
    goals,
    keepFocus,
  }: TaskQuickEditorProps) => {
    this.callbacks = callbacks || {};
    this.listId = task ? task.listId : listId;
    this.keepFocus = keepFocus;
    this.order = order || this.order;
    this.modes.tag.tagsMap = tagsMap;
    this.modes.space.spaces = spaces;
    this.modes.goal.goals = goals;

    if (task) {
      this.reset();
      this.task = task;
      this.value = task.title;
      this.modes.priority.priority = task.priority;
      this.modes.space.selectedSpaceId = task.spaceId;
      this.modes.goal.selectedGoalId = task.goalId;
      this.modes.tag.tags = task.tags.map((tag) => ({
        id: tag,
        title: tagsMap[tag] && tagsMap[tag].title,
      }));
    }
  };
}

export const {
  StoreProvider: TaskQuickEditorStoreProvider,
  useStore: useTaskQuickEditorStore,
} = getProvider(TaskQuickEditorStore);
