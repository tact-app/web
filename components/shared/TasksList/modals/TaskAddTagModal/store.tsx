import React, { SyntheticEvent } from 'react';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import { TaskTag } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export type TaskAddTagModalProps = {
  callbacks: {
    onClose: () => void;
    onSave: (tags: TaskTag[]) => void;
  },
  tags: string[];
};

export class TaskAddTagModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }
  startSymbol = '#';
  selectedTags: TaskTag[];
  showSuggestions: boolean = false;
  selectedTagsRefs = {};
  availableTagsRefs = {};
  suggestionsMenuRefs = {};
  inputRef = null;
  blockInFocus: string;

  keyMap = {
    FORCE_ENTER: ['meta+enter', 'ctrl+enter'],
    LEFT: ['left'],
    RIGHT: ['right'],
    DOWN: ['down'],
    UP: ['up'],

  };

  hotkeyHandlers = {
    FORCE_ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleSave();
    },
    LEFT: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modalNavigate(e);
    },
    RIGHT: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modalNavigate(e);
    },
    DOWN: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modalNavigate(e);
    },
    UP: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modalNavigate(e);
    },
  };

  strValue: string = '#';
  callbacks: TaskAddTagModalProps['callbacks'];

  get availableTags() {
    return this.root.resources.tags.list;
  }

  get filteredTags() {
    return this.availableTags.filter(
      ({ title }) =>
        title.startsWith(this.strValue) &&
        !this.selectedTags.some(({ title: tagTitle }) => tagTitle === title)
    );
  }

  get currentTagMatch() {
    return this.filteredTags.some(
      ({ title }) => title === this.strValue
    );
  }

  get hasTag() {
    return this.selectedTags.some(
      ({ title: tagTitle }) => tagTitle === this.strValue
    );
  }


  get isTagCreationAvailable() {
    return (
      this.strValue.length > 1 && !this.currentTagMatch && !this.hasTag
    );
  }

  setRef = (type: string, index?: number) => (el) => {
    switch (type) {
      case 'input':
        this.inputRef = el;
        break;
      case 'selectedTags':
        this.selectedTagsRefs[index] = el;
        break;
      case 'availableTags':
        this.availableTagsRefs[index] = el;
        break;
      case 'suggestionsMenu':
        this.suggestionsMenuRefs[index] = el;
        break;
    }
  }

  removeTag = (id: string, e?: SyntheticEvent) => {
    if (e) {
      const index = Number((e.target as HTMLButtonElement).name);
      const ref = this.selectedTagsRefs

      if (this.selectedTags.length === 1) {
        this.inputRef.focus();
      } else {
        (ref?.[index - 1] ?? ref?.[index + 1]).focus();
      }
    }

    this.selectedTags = this.selectedTags.filter((tag) => tag.id !== id);
  };

  addTag = (tag: TaskTag) => {
    this.selectedTags.push(tag);
  };

  createNewTag = (newTagTitle: string) => {
    const hasAvailableTag = this.availableTags.find(
      ({ title: tagTitle }) => tagTitle === newTagTitle
    );

    if (!hasAvailableTag) {
      const id = uuidv4();
      const newTag = { title: newTagTitle, id };
      this.addTag(newTag);
      this.root.resources.tags.add(newTag);
      return;
    }
    this.addTag(hasAvailableTag);
  };

  inputKeyDown = (e) => {
    const value = e.target.value
    const tagsLength = this.selectedTags.length

    if (this.showSuggestions && e.code === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      this.suggestionsMenuRefs[0].focus();
      this.changeFocusBlock('suggestionsMenu');
    }

    if (e.code === 'Backspace' && !value.length && tagsLength) {
      this.removeTag(this.selectedTags[tagsLength - 1].id, e)
    }
    if (e.code !== 'Enter' && e.code !== 'Space') return
    if (!value.trim()) {
      e.target.value = ''
      return
    }
    if (!this.hasTag) {
      this.createNewTag('#' + value)
      this.toggleSuggestion();
      e.target.value = ''
    }
  }

  modalNavigate = (e) => {
    const focusedBlock = this.blockInFocus;

    if (focusedBlock === 'input') {
      if (e.code === 'ArrowLeft' || (e.code === 'Tab' && e.shiftKey)) {
        if (this.selectedTags.length) {
          this.selectedTagsRefs[this.selectedTags.length - 1].focus();
          this.changeFocusBlock('selectedTags');
        }
      } else if (e.code === 'ArrowRight' || e.code === 'Tab' || (!this.showSuggestions && e.code === 'ArrowDown')) {
        if (this.availableTags.length) {
          this.availableTagsRefs[0].focus();
          this.changeFocusBlock('availableTags');
        }
      }
    } else if (focusedBlock === 'suggestionsMenu') {
      this.suggestionNavigate(e);
    } else {
      const tagsRefs = focusedBlock === 'selectedTags' ? this.selectedTagsRefs : this.availableTagsRefs
      const index = Number(e.target.name);

      if (e.code === 'ArrowLeft' || (e.code === 'Tab' && e.shiftKey)) {
        if (!!tagsRefs?.[index - 1]) {
          tagsRefs[index - 1].focus();
        } else if (focusedBlock === 'availableTags') {
          this.inputRef.focus();
          this.changeFocusBlock('input');
        }
      } else if (e.code === 'ArrowRight' || e.code === 'Tab') {
        if (!!tagsRefs?.[index + 1]) {
          tagsRefs[index + 1].focus();
        } else if (focusedBlock === 'selectedTags') {
          this.inputRef.focus();
          this.changeFocusBlock('input');
        }
      } else if (e.code === 'ArrowUp' && focusedBlock === 'availableTags' && index === 0) {
        this.inputRef.focus();
        this.changeFocusBlock('input');
      }
    }
  }

  suggestionNavigate = (e) => {
    const index = Number(e.target.name);
    const refs = this.suggestionsMenuRefs;
    const maxIndex = this.suggestions.length - 1;
    if (e.code === 'ArrowUp' || (e.code === 'Tab' && e.shiftKey)) {
      if (index > 0) {
        refs[index - 1].focus();
      } else {
        this.inputRef.focus();
        this.changeFocusBlock('input');
      }
    } else if ((e.code === 'ArrowDown' || e.code === 'Tab') && index < maxIndex) {
      refs[index + 1].focus();
    }
  }

  handleInputChange = (event) => {
    const value = event.target.value
    if ((value.length && !this.showSuggestions) || (!value.length && this.showSuggestions)) {
      this.toggleSuggestion();
    }

    this.strValue = this.startSymbol + value
  }

  handleFocusInput = (event) => {
    this.changeFocusBlock('input')
    if (event.target.value.length && !this.showSuggestions) {
      this.toggleSuggestion();
    }
  };

  addAvailableTag = (id: string) => {
    if (!this.availableTags.some(({ id: tagId }) => tagId === id)) {
      const tag = this.availableTags.find((tag) => tag.id === id);

      this.addTag(tag);
    }
  };

  handleSave = () => {
    this.callbacks.onSave(this.selectedTags);
  };

  get suggestions() {
    const hasCreateNewTag = this.isTagCreationAvailable;
    const tags = this.filteredTags;
    const items = tags.slice(0, 15).map(({ title }) => <>{title}</>);

    if (hasCreateNewTag) {
      items.unshift(
        <>
          Create new &quot;
          {this.strValue.slice(1)}&quot; tag
        </>
      );
    } else if (
      items.length === 0 &&
      tags.length === 0 &&
      this.strValue === this.startSymbol
    ) {
      items.push(<>Start typing to create a new tag</>);
    } else if (this.hasTag) {
      items.unshift(<>This tag is already used</>);
    }

    return items;
  }

  resetInput = () => {
    this.inputRef.value = '';
    this.showSuggestions = false;
    this.inputRef.focus();
  }

  handleSuggestionSelect = (index: number) => {
    if (this.strValue !== this.startSymbol || this.filteredTags.length) {
      if (
        index === 0 &&
        !this.currentTagMatch &&
        !this.hasTag &&
        this.strValue !== this.startSymbol
      ) {
        this.resetInput();
        this.createNewTag(this.strValue);
        return;
      }

      if (!this.hasTag || index > 0) {
        const hasFirstItem = !this.currentTagMatch || this.hasTag
        this.resetInput();
        this.addTag(
          this.filteredTags[hasFirstItem ? index - 1 : index]
        );
      }
    }
  };

  toggleSuggestion = () => {
    this.showSuggestions = !this.showSuggestions;
  }

  changeFocusBlock = (type: string) => {
    if (this.blockInFocus !== type) this.blockInFocus = type;
  }

  update = ({ callbacks, tags }: TaskAddTagModalProps) => {
    const selectedTags = this.availableTags.filter(({ id }) => tags.includes(id));
    this.selectedTags = selectedTags;
    this.callbacks = callbacks;
    if (selectedTags.length) {
      this.blockInFocus = 'selectedTags';
    } else {
      this.blockInFocus = 'input';
    }
  };
}

export const {
  StoreProvider: TaskAddTagModalStoreProvider,
  useStore: useTaskAddTagModalStore,
} = getProvider(TaskAddTagModalStore);
