import type { KeyboardEvent } from 'react';
import { SyntheticEvent } from 'react';
import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { TaskData, TaskStatus } from '../TasksList/types';
import { v4 as uuidv4 } from 'uuid';
import { TaskQuickEditorSuggestionsMenu } from './suggestionsMenuStore';
import { PriorityModeStore } from './modes/PriorityModeStore';
import { TagModeStore } from './modes/TagModeStore';
import { SpaceModeStore } from './modes/SpaceModeStore';
import { SUGGESTIONS_MENU_ID } from './TaskQuickEditorMenu';
import { TAGS_ID } from './TaskQuickEditorTags';
import { GoalModeStore } from './modes/GoalModeStore';
import { ReferenceModeStore } from './modes/ReferenceModeStore';
import { SpacesInboxItemData } from '../../pages/Spaces/types';
import { TasksEditorModals } from './modals/store';
import { NavigationDirections } from '../../../types/navigation';

export type TaskQuickEditorProps = {
  callbacks: {
    onSave?: (
      task: TaskData,
      withShift?: boolean,
      referenceId?: string
    ) => void | TaskData[] | Promise<void | TaskData[]>;
    onForceSave?: (taskId: string, referenceId?: string) => void;
    onFocus?: () => void;
    onSuggestionsMenuOpen?: (isOpen: boolean) => void;
    onNavigate?: (direction: NavigationDirections) => boolean;
    onModeNavigate?: (mode: Modes, direction: NavigationDirections) => boolean;
  };
  input?: SpacesInboxItemData;
  order?: Modes[];
  keepFocus?: boolean;
  task?: TaskData;
  enableReferences?: boolean;
  isCreator?: boolean;
  disableSpaceChange?: boolean;
  disableGoalChange?: boolean;
  disableReferenceChange?: boolean;
  defaultSpaceId?: string;
  defaultGoalId?: string;
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

  modals = new TasksEditorModals(this.root, this);
  order = [Modes.TAG, Modes.SPACE, Modes.PRIORITY, Modes.GOAL];
  callbacks: TaskQuickEditorProps['callbacks'];

  isCreator: boolean = false;

  modeStartPos = 0;
  modeEndPos = 0;
  maxDefaultModeTextLength = 50;
  activeModeType: Modes = Modes.DEFAULT;
  focusedMode: Modes | null = null;
  inputData: SpacesInboxItemData | null = null;
  defaultGoalId: null | string = null;
  defaultSpaceId: null | string = null;
  disableSpaceChange: boolean = false;
  disableGoalChange: boolean = false;
  disableReferenceChange: boolean = false;

  enableReferences: boolean = true;
  isMenuOpen: boolean = false;
  keepFocus: boolean = false;

  task: TaskQuickEditorProps['task'] = null;
  value: string = '';
  isInputFocused: boolean = false;
  isMenuFocused: boolean = false;

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
      }, 100);
    }
  };
  input: HTMLInputElement | null = null;

  savedCaretPosition: number = this.task ? this.task.title.length : 0;

  get isModeActive() {
    return this.activeModeType !== Modes.DEFAULT;
  }

  get activeMode() {
    return this.modes[this.activeModeType];
  }

  get maxLength() {
    if (!this.activeMode) {
      return this.maxDefaultModeTextLength;
    }

    if (this.activeMode.maxLength) {
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

  get disabledModes() {
    const disabledModes = [];

    if (this.disableGoalChange) {
      disabledModes.push(Modes.GOAL);
    }

    if (this.disableSpaceChange) {
      disabledModes.push(Modes.SPACE);
    }

    if (this.disableReferenceChange) {
      disabledModes.push(Modes.REFERENCE);
    }

    return disabledModes;
  }

  get isCurrentModeDisabled () {
    return this.disabledModes.includes(this.activeModeType)
  }

  getMatchMode = (symbol: string): Modes => {
    const matchMode = Object.entries(this.modes).find(
      ([key, mode]) => mode.startSymbol === symbol
    );

    const modeName: Modes = matchMode ? (matchMode[0] as Modes) : null;

    if (this.enableReferences) {
      return modeName;
    } else {
      return matchMode && modeName !== Modes.REFERENCE ? modeName : null;
    }
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

    this.suggestionsMenu.close();
    this.suggestionsMenu.closeForMode();
  };

  closeMenu = () => {
    this.isMenuOpen = false;
  };

  inputRef = (input: HTMLInputElement) => {
    this.input = input;
  };

  saveTask = (withShift?: boolean, force?: boolean) => {
    this.value = this.value.trim();

    if (this.callbacks.onSave && this.value) {
      const task: TaskData = {
        ...(toJS(this.task) || {}),
        title: this.value,
        input: toJS(this.task?.input || this.inputData),
        id: this.task ? this.task.id : uuidv4(),
        tags: this.modes.tag.tags.map(({ id }) => id),
        status: this.task ? this.task.status : TaskStatus.TODO,
        priority: this.modes.priority.priority,
        spaceId: this.defaultSpaceId || this.modes.space.selectedSpaceId || undefined,
        goalId: this.defaultGoalId || this.modes.goal.selectedGoalId || undefined,
      };

      const reference = this.modes[Modes.REFERENCE].selectedReferenceId;

      this.callbacks.onSave(task, withShift, reference);

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
        this.callbacks.onForceSave?.(task.id, reference);
      }
    }
  };

  removeFocus = () => {
    this.isInputFocused = false;
    this.isMenuFocused = false;
    this.input?.blur();

    this.closeMenu();
    this.suggestionsMenu.close();
    this.suggestionsMenu.closeForMode();
    this.modes.tag.handleCollapseClose();
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

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' && e.metaKey) {
      return;
    } else {
      e.stopPropagation();

      if (this.isModeActive) {
        this.handleKeyDownWithActiveMode(e);
      } else {
        this.handleKeyDownInStdMode(e);
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
      this.saveTask();
      this.setFocus(true);
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

  handleKeyDownModeButton =
    (modeType: Modes) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (this.root.isModalOpen) {
        return
      }

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
          if (this.suggestionsMenu.isOpen) {
            this.suggestionsMenu.closeForMode();
            this.focusMode(modeType, 'first');
          } else {
            this.handleLeaveAndRestoreTask();
          }
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
          } else if (e.key === 'ArrowDown') {
          if (modeType === Modes.PRIORITY) {
            if (this.modes.tag.tags.length) {
              this.focusMode(Modes.TAG, 'first');
            } else {
              this.callbacks.onNavigate?.(NavigationDirections.DOWN);
            }
          }

          return true;
        } else if (e.key === 'ArrowUp') {
          this.callbacks.onNavigate?.(NavigationDirections.UP);
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

  handleLeaveAndRestoreTask = () => {
    if (this.callbacks.onNavigate?.(NavigationDirections.INVARIANT)) {
      this.leave(true);
      this.restoreTask();
    }
  }

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

  modes = {
    [Modes.PRIORITY]: new PriorityModeStore(this.root, {
      onExit: () => this.exitMode(),
      onChangeSuggestionIndex: (index: number) =>
        this.suggestionsMenu.setIndex(index),
    }),
    [Modes.TAG]: new TagModeStore(this.root, {
      onExit: () => this.exitMode(),
      onLeave: () => this.handleLeaveAndRestoreTask(),
      onChange: (autoSave?: boolean) => {
        if (autoSave) {
          this.leave();
        }
      },
      onFocusLeave: (direction?: NavigationDirections) => {
        if (!direction) {
          this.suggestionsMenu.closeForMode();
        }

        if (direction === NavigationDirections.LEFT) {
          this.focusPrevFilledMode();
        } else if (direction === NavigationDirections.RIGHT) {
          this.focusNextFilledMode();
        } else if (direction === NavigationDirections.DOWN) {
          this.callbacks.onNavigate?.(direction);
        } else if (direction === NavigationDirections.UP) {
          this.setFocus(true);
        }
      },
    }),
    [Modes.SPACE]: new SpaceModeStore(this.root, {
      onExit: () => {
        this.exitMode();

        const goal = this.root.resources.goals.list.find((goal) =>
          goal.id === this.modes.goal.selectedGoalId && goal.spaceId === this.modes.space.selectedSpaceId
        );
        if (!goal) {
          this.modes.goal.selectedGoalId = null;
        }
      },
      onCreate: this.modals.openSpaceCreationModal
    }),
    [Modes.GOAL]: new GoalModeStore(this.root, {
      onExit: () => {
        this.exitMode();

        const goal = this.root.resources.goals.list.find((goal) => goal.id === this.modes.goal.selectedGoalId);
        if (goal) {
          this.modes.space.selectedSpaceId = goal.spaceId;
        }
      },
    }),
    [Modes.REFERENCE]: new ReferenceModeStore(this.root, {
      onExit: () => this.exitMode(),
    }),
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
    task,
    order,
    keepFocus,
    enableReferences,
    disableSpaceChange,
    disableGoalChange,
    disableReferenceChange,
    input,
    isCreator,
    defaultSpaceId: externalDefaultSpaceId,
    defaultGoalId,
  }: TaskQuickEditorProps) => {
    this.callbacks = callbacks || {};
    this.keepFocus = keepFocus;
    this.order = order || this.order;
    this.enableReferences = enableReferences;
    this.inputData = input;
    this.isCreator = isCreator;
    this.disableSpaceChange = disableSpaceChange;
    this.disableGoalChange = disableGoalChange;
    this.disableReferenceChange = disableReferenceChange;

    const defaultSpaceId = task?.spaceId || input?.spaceId || this.modes.space.selectedSpaceId;


    this.defaultSpaceId = externalDefaultSpaceId;
    this.defaultGoalId = defaultGoalId;

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
    } else if (externalDefaultSpaceId) {
      this.modes.space.selectedSpaceId = defaultSpaceId;
    } else if (this.root.resources.spaces.count) {
      if (defaultSpaceId) {
        this.modes.space.selectedSpaceId = defaultSpaceId;
      } else {
        this.modes.space.selectedSpaceId = this.modes.space.defaultSpace.id;
      }
    }
  };

  handleKeyDownInStdMode = (e: KeyboardEvent<HTMLInputElement>) => {
    const mode = this.getMatchMode(e.key);
    const target = e.target as HTMLInputElement;

    if (e.key === 'Escape') {
      e.stopPropagation();

      this.handleLeaveAndRestoreTask();
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();

      if (!this.keepFocus) {
        this.callbacks.onNavigate?.(NavigationDirections.ENTER);
      }

      this.saveTask(e.shiftKey, e.metaKey);
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

        if (e.key === 'ArrowDown' && this.modes.tag.tags.length && this.focusedMode !== Modes.TAG && !this.isCreator) {
          this.focusMode(Modes.TAG, 'first');
        } else if (this.callbacks.onNavigate?.(castArrowToDirection(e.key))) {
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
}

export const {
  StoreProvider: TaskQuickEditorStoreProvider,
  useStore: useTaskQuickEditorStore,
} = getProvider(TaskQuickEditorStore);
