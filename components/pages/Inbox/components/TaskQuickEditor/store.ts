import type { KeyboardEvent } from 'react';
import { SyntheticEvent } from 'react';
import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import {
  NavigationDirections,
  TaskData,
  TaskPriority,
  TaskPriorityKeys,
  TaskPriorityValues,
  TaskStatus,
  TaskTag
} from '../../store/types';
import { v4 as uuidv4 } from 'uuid';

export type TaskQuickEditorProps = {
  onCreate: (task: TaskData) => void;
  onTagCreate: (tag: TaskTag) => void;
  onNavigate: (direction: NavigationDirections) => void;
  tagsMap: Record<string, TaskTag>;
  listId: string;
  keepFocus?: boolean;
  task?: TaskData;
}

export class TaskQuickEditorStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  onCreate: TaskQuickEditorProps['onCreate'];
  onTagCreate: TaskQuickEditorProps['onTagCreate'];
  onNavigate: TaskQuickEditorProps['onNavigate'];

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

  get availableTags() {
    return Object.values(this.tagsMap);
  }

  get filteredAvailableTags() {
    return this.availableTags.filter(({ title }) => title.startsWith(this.currentTagValue));
  }

  get currentTagMatch() {
    return this.filteredAvailableTags.some(({ title }) => title === this.currentTagValue);
  }

  get tagsMenuOpen() {
    return Boolean(this.focused && this.tagActive && (this.currentTagValue.length > 1 || this.availableTags.length));
  }

  get priorityMenuOpen() {
    return Boolean(this.focused && this.priorityActive);
  }

  openMenu = () => {
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

    if (focusInput) {
      setTimeout(() => this.input.focus());
    }
  };

  setTagRef = (button: HTMLButtonElement, id: string) => {
    const tag = this.tags.find((tag) => tag.id === id);

    if (tag) {
      tag.ref = button;
    }
  };

  removeFocus = () => {
    this.focused = false;
    this.input.blur();

    if (!this.keepFocus) {
      this.createTask();
    }
  };

  activateTagMode = () => {
    this.tagActive = true;
    this.currentTagValue = '#';
  };

  disableTagMode = () => {
    this.tagActive = false;
    this.value = this.value.slice(0, this.value.length - this.currentTagValue.length);
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
      const tag = this.filteredAvailableTags.find(({ title }) => title === this.currentTagValue);

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
    this.currentPriorityValue = '!';
    this.priority = TaskPriority.LOW;
  };

  disablePriorityMode = () => {
    this.priorityActive = false;
    this.value = this.value.slice(0, this.value.length - this.currentPriorityValue.length);
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
  };

  commitPriority = () => {
    this.priorityActive = false;
    this.value = this.value.replace(this.currentPriorityValue, '');
    this.currentPriorityValue = '';
  };

  setPriorityAndCommit = (priority: TaskPriority) => {
    this.setPriority(priority);
    this.commitPriority();
  };

  createTask = () => {
    if (this.onCreate) {
      this.onCreate({
        title: this.value,
        id: this.task ? this.task.id : uuidv4(),
        listId: this.listId,
        tags: this.tags.map(({ id }) => id),
        description: this.task ? toJS(this.task.description) : { blocks: [] },
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

  handleChange = (e: SyntheticEvent) => {
    const { value } = (e.target as HTMLInputElement);

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
    } else if (this.priorityActive) {
      this.handleKeyDownInPriorityMode(e);
    } else if (this.tagActive) {
      this.handleKeyDownInTagMode(e);
    }
  };

  handleKeyDownInStdMode = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      this.removeFocus();
    } else if (e.key === 'Enter') {
      this.createTask();
    } else if (e.key === '#' && e.target.selectionEnd === this.value.length) {
      this.activateTagMode();
    } else if (e.key === '!') {
      this.activatePriorityMode();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.removeFocus();
      this.onNavigate(e.key === 'ArrowDown' ? NavigationDirections.DOWN : NavigationDirections.UP);
    } else if (e.key === 'ArrowRight' && e.target.selectionEnd === this.value.length && this.tags.length) {
      this.tags[0].ref.focus();
    }
  };

  handleKeyDownInTagMode = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && this.currentTagValue.length > 1) {
      e.preventDefault();
      this.createNewTag();
    } else if ((e.key === 'Backspace' || e.key === ' ') && this.currentTagValue.length === 1) {
      e.preventDefault();
      this.disableTagMode();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.disableTagMode();
    } else if (e.key === 'ArrowDown') {

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
        this.setPriority(TaskPriorityKeys[this.currentPriorityValue.slice(0, -1)]);
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

  init = ({ onCreate, onTagCreate, listId, onNavigate, task, tagsMap, keepFocus }: TaskQuickEditorProps) => {
    this.onCreate = onCreate;
    this.onTagCreate = onTagCreate;
    this.onNavigate = onNavigate;
    this.tagsMap = tagsMap;
    this.listId = listId;
    this.keepFocus = keepFocus;

    if (task) {
      this.task = task;
      this.value = task.title;
      this.priority = task.priority;
      this.tags = task.tags.map((tag) => ({ id: tag, title: tagsMap[tag].title }));
    }
  };
}

export const {
  StoreProvider: TaskQuickEditorStoreProvider,
  useStore: useTaskQuickEditorStore
} = getProvider(TaskQuickEditorStore);