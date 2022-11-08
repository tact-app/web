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

export type TaskQuickEditorProps = {
  onSave: (task: TaskData) => void;
  onSuggestionsMenuOpen?: (isOpen: boolean) => void;
  onTagCreate: (tag: TaskTag) => void;
  onNavigate: (direction: NavigationDirections) => boolean;
  tagsMap: Record<string, TaskTag>;
  spaces: SpaceData[];
  listId: string;
  keepFocus?: boolean;
  task?: TaskData;
};

export enum Modes {
  DEFAULT = 'default',
  PRIORITY = 'priority',
  TAG = 'tag',
  SPACE = 'space',
}

// ToDo: Удалять спейс при нажатии на бекспейс
// ToDo: Открывать меню выбора спейса при нажатии на его иконку/ентер

export class TaskQuickEditorStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  suggestionsMenu = new TaskQuickEditorSuggestionsMenu({
    onSelect: (index: number) => this.handleSuggestionSelect(index),
    onOpen: (isOpen: boolean) => this.onSuggestionsMenuOpen?.(isOpen),
  });

  onSave: TaskQuickEditorProps['onSave'];
  onTagCreate: TaskQuickEditorProps['onTagCreate'];
  onNavigate: TaskQuickEditorProps['onNavigate'];
  onSuggestionsMenuOpen: TaskQuickEditorProps['onSuggestionsMenuOpen'];

  modes = {
    [Modes.PRIORITY]: new PriorityModeStore({
      onExit: () => this.exitMode(),
      onChangeSuggestionIndex: (index: number) =>
        this.suggestionsMenu.setIndex(index),
    }),
    [Modes.TAG]: new TagModeStore({
      onExit: () => this.exitMode(),
      onFocusInput: () => this.input?.focus(),
      onTagCreate: (tag: TaskTag) => this.onTagCreate(tag),
    }),
    [Modes.SPACE]: new SpaceModeStore({
      onExit: () => this.exitMode(),
    }),
  };

  modeStartPos = 0;
  modeEndPos = 0;
  activeModeType: Modes = Modes.DEFAULT;

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

  handleClickOutside = (e: Event) => {
    let currentElem = e.target as HTMLElement;

    while (currentElem) {
      const attr = currentElem.getAttribute('data-id');
      if (attr === SUGGESTIONS_MENU_ID || attr === TAGS_ID) {
        return;
      }

      currentElem = currentElem.parentElement;
    }

    if (this.focused) {
      this.leave();
    }
  };

  leave = () => {
    this.focused = false;
    this.input?.blur();

    if (!this.keepFocus) {
      this.saveTask();
    }

    this.closeMenu();
    this.suggestionsMenu.close();
    this.suggestionsMenu.closeForMode();
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

  saveTask = () => {
    if (this.onSave && this.value) {
      this.onSave({
        title: this.value,
        id: this.task ? this.task.id : uuidv4(),
        listId: this.listId,
        tags: this.modes.tag.tags.map(({ id }) => id),
        status: TaskStatus.TODO,
        priority: this.modes.priority.priority,
        spaceId: this.modes.space.selectedSpaceId || undefined,
      });

      if (this.keepFocus) {
        this.focused = true;
        this.value = '';
        this.resetModes();
      } else if (this.focused) {
        this.input?.blur();
      }
    }
  };

  handleFocus = () => {
    this.setFocus();
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

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!this.isModeActive) {
      this.handleKeyDownInStdMode(e);
    } else if (!this.handleKeyDownWithActiveMode(e)) {
      this.activeMode.handleKeyDown?.(e);
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
        this.suggestionsMenu.closeForMode();

        return true;
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        this.modes[this.suggestionsMenu.openForMode].reset();
        this.input?.focus();
        return true;
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
      if (this.onNavigate(NavigationDirections.LEFT)) {
        this.leave();
      }
    } else if (e.key === 'Enter') {
      this.saveTask();
    } else if (mode) {
      this.enterMode(mode, e);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (
        this.onNavigate(
          e.key === 'ArrowDown'
            ? NavigationDirections.DOWN
            : NavigationDirections.UP
        )
      ) {
        this.leave();
      }
    } else if (
      e.key === 'ArrowRight' &&
      (e.target as HTMLInputElement).selectionEnd === this.value.length
    ) {
      this.modes.tag.enterTagsList();
    }
  };

  reset = () => {
    this.value = '';
    this.resetModes();
    this.activeModeType = Modes.DEFAULT;
  };

  update = ({
    onSave,
    onSuggestionsMenuOpen,
    onTagCreate,
    listId,
    onNavigate,
    task,
    tagsMap,
    spaces,
    keepFocus,
  }: TaskQuickEditorProps) => {
    this.onSave = onSave;
    this.onTagCreate = onTagCreate;
    this.onNavigate = onNavigate;
    this.onSuggestionsMenuOpen = onSuggestionsMenuOpen;
    this.listId = listId;
    this.keepFocus = keepFocus;
    this.modes.tag.tagsMap = tagsMap;
    this.modes.space.spaces = spaces;

    if (task) {
      this.task = task;
      this.value = task.title;
      this.modes.priority.priority = task.priority;
      this.modes.tag.tags = task.tags.map((tag) => ({
        id: tag,
        title: tagsMap[tag].title,
      }));
    }
  };
}

export const {
  StoreProvider: TaskQuickEditorStoreProvider,
  useStore: useTaskQuickEditorStore,
} = getProvider(TaskQuickEditorStore);
