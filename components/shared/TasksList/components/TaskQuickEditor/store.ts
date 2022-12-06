import type { KeyboardEvent } from 'react';
import { SyntheticEvent } from 'react';
import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { NavigationDirections, TaskData, TaskStatus } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { TaskQuickEditorSuggestionsMenu } from './suggestionsMenuStore';
import { PriorityModeStore } from './modes/PriorityModeStore';
import { TagModeStore } from './modes/TagModeStore';
import { SpaceModeStore } from './modes/SpaceModeStore';
import { SUGGESTIONS_MENU_ID } from './TaskQuickEditorMenu';
import { TAGS_ID } from './TaskQuickEditorTags';
import { GoalModeStore } from './modes/GoalModeStore';
import { ReferenceModeStore } from './modes/ReferenceModeStore';

export type TaskQuickEditorProps = {
  callbacks: {
    onSave?: (task: TaskData, withShift?: boolean) => void;
    onForceSave?: (taskId: string) => void;
    onFocus?: () => void;
    onSuggestionsMenuOpen?: (isOpen: boolean) => void;
    onNavigate?: (direction: NavigationDirections) => boolean;
    onModeNavigate?: (mode: Modes, direction: NavigationDirections) => boolean;
  };
  defaultSpaceId?: string;
  order?: Modes[];
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
  REFERENCE = 'reference',
}

const castArrowToDirection = (key: string): NavigationDirections => {
  switch (key) {
    case 'ArrowDown':
      return NavigationDirections.DOWN;
    case 'Tab':
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
    [Modes.PRIORITY]: new PriorityModeStore(this.root, {
      onExit: () => this.exitMode(),
      onChangeSuggestionIndex: (index: number) =>
        this.suggestionsMenu.setIndex(index),
    }),
    [Modes.TAG]: new TagModeStore(this.root, {
      onExit: () => this.exitMode(),
      onFocusLeave: (direction: NavigationDirections) => {
        if (direction === NavigationDirections.LEFT) {
          this.focusPrevFilledMode();
        } else if (direction === NavigationDirections.RIGHT) {
          this.focusNextFilledMode();
        }
      },
    }),
    [Modes.SPACE]: new SpaceModeStore(this.root, {
      onExit: () => this.exitMode(),
    }),
    [Modes.GOAL]: new GoalModeStore(this.root, {
      onExit: () => this.exitMode(),
    }),
    [Modes.REFERENCE]: new ReferenceModeStore(this.root, {
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
  isInputFocused: boolean = false;
  isMenuFocused: boolean = false;
  input: HTMLInputElement | null = null;

  savedCaretPosition: number = this.task ? this.task.title.length : 0;

  get isModeActive() {
    return this.activeModeType !== Modes.DEFAULT;
  }

  get activeMode() {
    return this.modes[this.activeModeType];
  }

  get maxLength() {
    if (this.activeMode?.maxLength) {
      return (
        this.value.length +
        this.activeMode.maxLength -
        this.activeMode.strValue.length
      );
    }
  }

  get filledModes() {
    return Object.entries(this.modes)
      .filter(([, mode]) => mode.isFilled)
      .map(([name]) => name) as Modes[];
  }

  get isFilled() {
    return this.filledModes.filter((mode) => mode !== Modes.TAG).length > 0;
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
    if (!silent && this.activeMode) {
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

    this.activeModeType = Modes.DEFAULT;
    this.suggestionsMenu.close();
  };

  openMenu = () => {
    this.isInputFocused = true;
    this.isMenuOpen = true;
  };

  closeMenu = () => {
    this.isMenuOpen = false;
  };

  inputRef = (input: HTMLInputElement) => {
    this.input = input;
  };

  setFocus = (focusInput?: boolean) => {
    this.isInputFocused = true;

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
    this.isInputFocused = false;
    this.isMenuFocused = false;
    this.input?.blur();

    this.closeMenu();
    this.suggestionsMenu.close();
    this.suggestionsMenu.closeForMode();
  };

  handleClickOutside = (e: Event) => {
    let currentElem = e.target as HTMLElement;

    if (this.isInputFocused || this.isMenuFocused) {
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

    this.isMenuFocused = false;
  };

  leave = (withoutSaving: boolean = false) => {
    this.removeFocus();

    if (!this.keepFocus && !withoutSaving) {
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
      return true;
    }

    return false;
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

  saveTask = (withShift?: boolean, force?: boolean) => {
    if (this.callbacks.onSave && this.value) {
      const task = {
        ...(toJS(this.task) || {}),
        title: this.value,
        id: this.task ? this.task.id : uuidv4(),
        listId: this.listId,
        tags: this.modes.tag.tags.map(({ id }) => id),
        status: this.task ? this.task.status : TaskStatus.TODO,
        priority: this.modes.priority.priority,
        spaceId: this.modes.space.selectedSpaceId || undefined,
        goalId: this.modes.goal.selectedGoalId || undefined,
      };

      this.callbacks.onSave(task, withShift);

      if (this.keepFocus) {
        if (force) {
          this.removeFocus();
        } else {
          this.isInputFocused = true;
        }

        this.value = '';
        this.resetModes();
      } else if (this.isInputFocused) {
        this.removeFocus();
      }

      if (force) {
        this.callbacks.onForceSave?.(task.id);
      }
    }
  };

  handleFocus = () => {
    this.setFocus();
    this.focusedMode = null;
    this.suggestionsMenu.closeForMode();
    this.callbacks.onFocus?.();
  };

  handleFocusMenu = () => {
    this.isMenuFocused = true;
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

      if (this.isInputFocused) {
        this.setFocus(true);
      } else if (!this.keepFocus) {
        this.saveTask();
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
        if (this.modeEndPos < target.selectionEnd) {
          this.modeEndPos = target.selectionEnd;
        } else {
          this.modeEndPos -= this.value.length - value.length;
        }

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
    if (e.key === 'e' && e.metaKey) {
      return;
    } else {
      e.stopPropagation();

      if (!this.isModeActive) {
        this.handleKeyDownInStdMode(e);
      } else {
        this.handleKeyDownWithActiveMode(e);
      }
    }
  };

  handleSuggestionMenuNavigation = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.prev();

      return true;
    } else if (e.key === 'ArrowDown' || e.key === 'Tab') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.next();

      return true;
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.commit();

      return true;
    }

    return false;
  };

  handleKeyDownModeButton =
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
          this.focusMode(modeType, 'first');
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
      } else if (this.suggestionsMenu.openForMode === Modes.DEFAULT) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight'
        ) {
          e.preventDefault();
          e.stopPropagation();

          if (e.key === 'ArrowRight' && this.focusNextFilledMode()) {
            return true;
          } else if (e.key === 'ArrowLeft' && this.focusPrevFilledMode()) {
            return true;
          } else if (
            this.callbacks.onModeNavigate?.(
              modeType,
              castArrowToDirection(e.key)
            )
          ) {
            return true;
          } else {
            this.setFocus(true);
            return true;
          }
        } else {
          return false;
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
      e.stopPropagation();
      e.preventDefault();
      this.activeMode.disable();
      return true;
    }

    return false;
  };

  handleKeyDownInStdMode = (e: KeyboardEvent<HTMLInputElement>) => {
    const mode = this.getMatchMode(e.key);
    const target = e.target as HTMLInputElement;

    if (e.key === 'Escape') {
      e.stopPropagation();

      if (this.callbacks.onNavigate?.(NavigationDirections.INVARIANT)) {
        this.leave(true);
        this.restoreTask();
      }
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      if (!this.keepFocus) {
        this.callbacks.onNavigate?.(NavigationDirections.ENTER);
      }

      this.saveTask(e.shiftKey, e.metaKey || e.ctrlKey);
    } else if (mode) {
      e.stopPropagation();
      this.enterMode(mode, e);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.stopPropagation();

      const hasRange = target.selectionStart !== target.selectionEnd;
      const isCorner =
        (target.selectionStart === 0 && e.key === 'ArrowUp') ||
        (target.selectionStart === this.value.length && e.key === 'ArrowDown');

      if (!hasRange && isCorner) {
        e.preventDefault();

        if (this.callbacks.onNavigate?.(castArrowToDirection(e.key))) {
          this.leave();
        }
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      this.leave();
    } else if (e.key === 'ArrowRight') {
      e.stopPropagation();
      if (
        target.selectionEnd === this.value.length &&
        this.input.selectionStart === this.input.selectionEnd
      ) {
        this.focusFirstFilledMode();
      }
    } else if (e.key === 'ArrowLeft') {
      e.stopPropagation();
    }
  };

  handleKeyDownMainMenu = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Tab') {
      this.removeFocus();
    }
  };

  reset = () => {
    this.value = '';
    this.resetModes();
    this.activeModeType = Modes.DEFAULT;
  };

  restoreTask = () => {
    if (this.task) {
      this.value = this.task.title;
      this.modes.priority.priority = this.task.priority;
      this.modes.space.selectedSpaceId =
        this.task.spaceId || this.modes.space.defaultSpace.id;
      this.modes.goal.selectedGoalId = this.task.goalId;
      this.modes.tag.tags = this.task.tags.map((tag) => {
        const existedTag = this.root.resources.tags.map[tag];

        return {
          id: tag,
          title: existedTag && existedTag.title,
        };
      });
    }
  };

  update = ({
    callbacks,
    listId,
    task,
    order,
    keepFocus,
    defaultSpaceId,
  }: TaskQuickEditorProps) => {
    this.callbacks = callbacks || {};
    this.listId = task ? task.listId : listId;
    this.keepFocus = keepFocus;
    this.order = order || this.order;

    if (task) {
      if (
        (this.task === null && task) ||
        (task && this.task && this.task.id !== task.id)
      ) {
        this.savedCaretPosition = task.title.length;
      }

      this.reset();
      this.task = task;
      this.restoreTask();
    } else if (this.root.resources.spaces.count) {
      if (defaultSpaceId) {
        this.modes.space.selectedSpaceId = defaultSpaceId;
      } else {
        this.modes.space.selectedSpaceId = this.modes.space.defaultSpace.id;
      }
    }
  };
}

export const {
  StoreProvider: TaskQuickEditorStoreProvider,
  useStore: useTaskQuickEditorStore,
} = getProvider(TaskQuickEditorStore);
