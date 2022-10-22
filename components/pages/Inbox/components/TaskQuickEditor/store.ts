import type { KeyboardEvent } from 'react';
import { SyntheticEvent } from 'react';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import {
  NavigationDirections,
  TaskData,
  TaskPriority,
  TaskPriorityArray,
  TaskPriorityKeys,
  TaskPriorityValues,
  TaskStatus,
  TaskTag,
} from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { TaskQuickEditorSuggestionsMenu } from './suggestionsMenuStore';

export type TaskQuickEditorProps = {
  onSave: (task: TaskData) => void;
  onSuggestionsMenuOpen?: (isOpen: boolean) => void;
  onTagCreate: (tag: TaskTag) => void;
  onNavigate: (direction: NavigationDirections) => void;
  tagsMap: Record<string, TaskTag>;
  listId: string;
  keepFocus?: boolean;
  task?: TaskData;
};

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

  isMenuOpen: boolean = false;
  keepFocus: boolean = false;

  task: TaskQuickEditorProps['task'] = null;
  listId: string;
  value: string = '';
  focused: boolean = false;
  input: HTMLInputElement | null = null;

  tagsMap: Record<string, TaskTag> = {};
  tags: Array<TaskTag & { ref?: HTMLButtonElement }> = [];
  currentTagValue: string = '';
  tagActive: boolean = false;

  currentPriorityValue: string = '';
  priority: TaskPriority = TaskPriority.NONE;
  priorityActive: boolean = false;

  savedCaretPosition: number = 0;

  get availableTags() {
    return Object.values(this.tagsMap);
  }

  get filteredAvailableTags() {
    return this.availableTags.filter(
      ({ title }) =>
        title.startsWith(this.currentTagValue) &&
        !this.tags.some(({ title: t }) => title === t)
    );
  }

  get currentTagMatch() {
    return this.filteredAvailableTags.some(
      ({ title }) => title === this.currentTagValue
    );
  }

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

    if (this.tagActive || this.priorityActive) {
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

  setTagRef = (button: HTMLButtonElement, id: string) => {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      tag.ref = button;
    }
  };

  handleClickOutside = () => {
    this.focused = false;
    this.input?.blur();

    if (!this.keepFocus) {
      this.saveTask();
    }

    this.closeMenu();
    this.suggestionsMenu.close();
  };

  removeInputFocus = () => {
    this.input.blur();

    if (!this.keepFocus) {
      this.handleClickOutside();
    }
  };

  activateTagMode = () => {
    this.tagActive = true;
    this.suggestionsMenu.open();
    this.currentTagValue = '#';
  };

  disableTagMode = () => {
    this.tagActive = false;
    this.suggestionsMenu.close();
    this.value = this.value.slice(
      0,
      this.value.length - this.currentTagValue.length
    );
    this.currentTagValue = '';
    this.input.focus();
  };

  startTag = () => {
    this.activateTagMode();
    this.value += ' #';
    this.input.focus();
  };

  removeTag = (id: string, setFocus?: boolean) => {
    const index = this.tags.findIndex((tag) => tag.id === id);
    this.tags.splice(index, 1);

    if (setFocus) {
      this.input.focus();
    }
  };

  createNewTag = () => {
    if (!this.currentTagMatch) {
      const id = uuidv4();
      const newTag = { title: this.currentTagValue, id };

      this.tags.push(newTag);

      if (this.onTagCreate) {
        this.onTagCreate(newTag);
      }
    } else {
      const tag = this.filteredAvailableTags.find(
        ({ title }) => title === this.currentTagValue
      );

      if (tag) {
        this.tags.push(tag);
      }
    }

    this.disableTagMode();
  };

  addAvailableTag = (id: string) => {
    const tag = this.availableTags.find((tag) => tag.id === id);

    this.tags.push(tag);
    this.disableTagMode();
  };

  activatePriorityMode = () => {
    this.priorityActive = true;
    this.suggestionsMenu.open();
    this.currentPriorityValue = '!';
    this.priority = TaskPriority.LOW;
  };

  disablePriorityMode = () => {
    this.priorityActive = false;
    this.suggestionsMenu.close();
    this.value = this.value.slice(
      0,
      this.value.length - this.currentPriorityValue.length
    );
    this.currentPriorityValue = '';
    this.priority = TaskPriority.NONE;
    this.input.focus();
  };

  startPriority = () => {
    this.activatePriorityMode();
    this.value += '!';
    this.input.focus();
  };

  setPriority = (priority: TaskPriority) => {
    const priorityValue = TaskPriorityValues[priority];

    this.priority = priority;
    this.currentPriorityValue = priorityValue;
    this.value = this.value.replace(/!+$/, priorityValue);
    this.suggestionsMenu.setIndex(TaskPriorityArray.indexOf(priority));
  };

  commitPriority = () => {
    this.priorityActive = false;
    this.value = this.value.replace(this.currentPriorityValue, '');
    this.currentPriorityValue = '';
    this.suggestionsMenu.close();
  };

  setPriorityAndCommit = (priority: TaskPriority) => {
    this.setPriority(priority);
    this.commitPriority();
  };

  saveTask = () => {
    if (this.onSave) {
      this.onSave({
        title: this.value,
        id: this.task ? this.task.id : uuidv4(),
        listId: this.listId,
        tags: this.tags.map(({ id }) => id),
        status: TaskStatus.TODO,
        priority: this.priority,
      });

      if (this.keepFocus) {
        this.focused = true;
        this.value = '';
        this.tags = [];
        this.priority = TaskPriority.NONE;
      } else {
        this.input.blur();
      }
    }
  };

  handleFocus = () => {
    this.setFocus();
  };

  handleSuggestionSelect = (index: number) => {
    if (this.tagActive) {
      const hasCreateNewTag =
        this.currentTagValue.length > 1 && !this.currentTagMatch;

      if (!hasCreateNewTag) {
        this.addAvailableTag(this.filteredAvailableTags[index].id);
      } else {
        this.createNewTag();
      }
    } else if (this.priorityActive) {
      this.setPriorityAndCommit(TaskPriorityArray[index]);
    }

    this.setFocus(true);
  };

  handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;

    this.savedCaretPosition = target.selectionStart;
    this.value = value;

    if (this.tagActive && !this.value.includes('#')) {
      this.disableTagMode();
    }

    if (this.priorityActive && !this.value.includes('!')) {
      this.disablePriorityMode();
    }

    if (this.tagActive) {
      this.currentTagValue = value.replace(/^.+#/g, '#');
    }

    if (this.priorityActive && !value.endsWith('!')) {
      this.commitPriority();
    }
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!this.tagActive && !this.priorityActive) {
      this.handleKeyDownInStdMode(e);
    } else if (this.tagActive || this.priorityActive) {
      this.handleKeyDownWithMenuOpen(e);

      if (this.priorityActive) {
        this.handleKeyDownInPriorityMode(e);
      } else if (this.tagActive) {
        this.handleKeyDownInTagMode(e);
      }
    }
  };

  handleKeyDownWithMenuOpen = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.next();
    } else if (e.key === 'ArrowUp') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.prev();
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
      this.suggestionsMenu.commit();
    }
  };

  handleKeyDownInStdMode = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      this.handleClickOutside();
    } else if (e.key === 'Enter') {
      this.saveTask();
    } else if (
      e.key === '#' &&
      (e.target as HTMLInputElement).selectionEnd === this.value.length
    ) {
      this.activateTagMode();
    } else if (e.key === '!') {
      this.activatePriorityMode();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.handleClickOutside();
      this.onNavigate(
        e.key === 'ArrowDown'
          ? NavigationDirections.DOWN
          : NavigationDirections.UP
      );
    } else if (
      e.key === 'ArrowRight' &&
      (e.target as HTMLInputElement).selectionEnd === this.value.length &&
      this.tags.length
    ) {
      this.tags[0].ref.focus();
    }
  };

  handleKeyDownInTagMode = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === ' ' || e.key === 'Enter') &&
      this.currentTagValue.length > 1
    ) {
      e.preventDefault();
      this.createNewTag();
    } else if (
      (e.key === 'Backspace' || e.key === ' ') &&
      this.currentTagValue.length === 1
    ) {
      e.preventDefault();
      this.disableTagMode();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.disableTagMode();
    }
  };

  handleKeyDownInPriorityMode = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '!') {
      e.preventDefault();

      if (this.currentPriorityValue.length < 3) {
        this.setPriority(TaskPriorityKeys[this.currentPriorityValue + '!']);
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();

      if (this.currentPriorityValue.length > 1) {
        this.setPriority(
          TaskPriorityKeys[this.currentPriorityValue.slice(0, -1)]
        );
      } else {
        this.disablePriorityMode();
      }
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.commitPriority();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.disablePriorityMode();
    }
  };

  handleTagKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      this.removeTag(id, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const index = this.tags.findIndex((tag) => tag.id === id);

      if (index === 0) {
        this.input.focus();
      } else {
        const nextTag = this.tags[index - 1];

        if (nextTag) {
          nextTag.ref.focus();
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const index = this.tags.findIndex((tag) => tag.id === id);
      const nextTag = this.tags[index + 1];

      if (nextTag) {
        nextTag.ref.focus();
      }
    }
  };

  init = ({
    onSave,
    onSuggestionsMenuOpen,
    onTagCreate,
    listId,
    onNavigate,
    task,
    tagsMap,
    keepFocus,
  }: TaskQuickEditorProps) => {
    this.onSave = onSave;
    this.onTagCreate = onTagCreate;
    this.onNavigate = onNavigate;
    this.onSuggestionsMenuOpen = onSuggestionsMenuOpen;
    this.tagsMap = tagsMap;
    this.listId = listId;
    this.keepFocus = keepFocus;

    if (task) {
      this.task = task;
      this.value = task.title;
      this.priority = task.priority;
      this.tags = task.tags.map((tag) => ({
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
