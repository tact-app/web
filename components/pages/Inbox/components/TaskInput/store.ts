import type { KeyboardEvent } from 'react';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { SyntheticEvent } from 'react';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { TaskData, TaskPriority, TaskPriorityKeys, TaskPriorityValues, TaskStatus } from '../../store/types';
import { v4 as uuidv4 } from 'uuid';

export type TaskInputProps = {
  onCreate: (task: TaskData) => void;
}

class TaskInputStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  onCreate: TaskInputProps['onCreate'];

  value: string = '';
  focused: boolean = false;
  input: HTMLInputElement | null = null;
  firstTag: HTMLButtonElement | null = null;

  tags: { title: string, ref?: HTMLButtonElement }[] = [];
  currentTagValue: string = '';
  tagActive: boolean = false;

  currentPriorityValue: string = '';
  priority: TaskPriority = TaskPriority.NONE;
  priorityActive: boolean = false;

  inputRef = (input: HTMLInputElement) => {
    this.input = input;
  };

  setFocus = () => {
    this.focused = true;
  };

  setTagRef = (button: HTMLButtonElement, index: number) => {
    if (this.tags[index]) {
      this.tags[index].ref = button;
    }
  };

  removeFocus = () => {
    this.focused = false;
  };

  activateTagMode = () => {
    this.tagActive = true;
    this.currentTagValue = '#';
  };

  disableTagMode = () => {
    this.tagActive = false;
    this.value = this.value.slice(0, this.value.length - this.currentTagValue.length);
    this.currentTagValue = '';
  };

  activatePriorityMode = () => {
    this.priorityActive = true;
    this.currentPriorityValue = '!';
    this.priority = TaskPriority.LOW;
  };

  startPriority = () => {
    this.activatePriorityMode();
    this.value += '!';
    this.input.focus();
  }

  setPriority = (priority: TaskPriority) => {
    const priorityValue = TaskPriorityValues[priority];

    this.priority = priority;
    this.currentPriorityValue = priorityValue;
    this.value = this.value.replace(/!+$/, priorityValue);
  }

  startTag = () => {
    this.activateTagMode();
    this.value += ' #';
    this.input.focus();
  };

  removeTag = (index: number, focus?: boolean) => {
    this.tags.splice(index, 1);

    if (focus) {
      this.input.focus();
    }
  };

  createTag = () => {
    this.tags.push({ title: this.currentTagValue });
    this.value = this.value.slice(0, -this.currentTagValue.length);
    this.currentTagValue = '';
    this.tagActive = false;
  };

  createTask = () => {
    this.onCreate({
      title: this.value,
      id: uuidv4(),
      tags: this.tags.map(({ title }) => title),
      description: { blocks: [] },
      status: TaskStatus.PENDING,
      priority: this.priority,
    });
    this.value = '';
    this.tags = [];
    this.focused = true;
  };

  handleChange = (e: SyntheticEvent) => {
    const { value } = (e.target as HTMLInputElement);

    this.value = value;

    if (this.tagActive) {
      this.currentTagValue = value.replace(/^.+#/g, '#');
    }
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.createTask();
    } else if (e.key === '#' && e.target.selectionEnd === this.value.length && !this.tagActive && !this.priorityActive) {
      this.activateTagMode();
    } else if (e.key === '!' && !this.tagActive && !this.priorityActive) {
      this.activatePriorityMode();
    } else if (this.priorityActive) {
      if (e.key === '!') {
        e.preventDefault();

        if (this.currentPriorityValue.length < 3) {
          this.setPriority(TaskPriorityKeys[this.currentPriorityValue + '!']);
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        this.setPriority(TaskPriorityKeys[this.currentPriorityValue.slice(0, -1)]);
      } if (e.key === ' ') {
        e.preventDefault();
        this.priorityActive = false;
        this.value = this.value.replace(this.currentPriorityValue, '');
        this.currentPriorityValue = '';
      }
    } else if (this.tagActive && !this.priorityActive) {
      if (e.key === ' ' && this.currentTagValue.length > 1) {
        e.preventDefault();
        this.createTag();
      } else if ((e.key === 'Backspace' || e.key === ' ') && this.currentTagValue.length === 1) {
        e.preventDefault();
        this.disableTagMode();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.disableTagMode();
      }
    } else if (e.key === 'ArrowRight' && e.target.selectionEnd === this.value.length && this.tags.length) {
      this.tags[0].ref.focus();
    }
  };

  handleTagKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      this.removeTag(index, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();

      if (index === 0) {
        this.input.focus();
      } else {
        const nextTag = this.tags[index - 1];

        if (nextTag) {
          nextTag.ref?.focus();
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTag = this.tags[index + 1];

      if (nextTag) {
        nextTag.ref?.focus();
      }
    }
  };

  init = ({ onCreate }) => {
    this.onCreate = onCreate;
  };
}

export const {
  StoreProvider: TaskInputStoreProvider,
  useStore: useTaskInputStore
} = getProvider(TaskInputStore);