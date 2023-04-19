import React from 'react';
import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { RootStore } from '../../../../../stores/RootStore';
import { TaskTag } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { TaskQuickEditorSuggestionsMenu } from '../../../TaskQuickEditor/suggestionsMenuStore';

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

  keyMap = {
    FORCE_ENTER: ['meta+enter', 'ctrl+enter'],
  };

  hotkeyHandlers = {
    FORCE_ENTER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleSave();
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

  removeTag = (id: string) => {
    this.selectedTags = this.selectedTags.filter((tag) => tag.id !== id);
  };

  addTag = (tag: TaskTag) => {
    this.selectedTags.push(tag);
  };

  createNewTag = (newTagTitle: string) => {

    const hasTag = this.availableTags.find(
      ({ title: tagTitle }) => tagTitle === newTagTitle
    );

    if (!hasTag) {
      const id = uuidv4();
      const newTag = { title: newTagTitle, id };
      this.addTag(newTag);
      this.root.resources.tags.add(newTag);
      return;
    }
    this.addTag(hasTag);
  };

  inputKeyDown = (e) => {
    const value = e.target.value
    const tagsLength = this.selectedTags.length
    if (e.code === 'Backspace' && !value.length && tagsLength) {
      this.removeTag(this.selectedTags[tagsLength - 1].id)
    }
    if (e.code !== 'Enter' && e.code !== 'Space') return
    if (!value.trim()) {
      e.target.value = ''
      return
    }
    this.createNewTag('#' + value)
    e.target.value = ''
  }
  handleInputChange = (event) => {
    const value = event.target.value
    if ((value.length && !this.showSuggestions) || (!value.length && this.showSuggestions)) {
      this.toggleSuggestion();
    }

    this.strValue = this.startSymbol + value
  }

  handleFocusMenu = (event) => {
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

  update = ({ callbacks, tags }: TaskAddTagModalProps) => {
    this.selectedTags = this.availableTags.filter(({ id }) => tags.includes(id));
    this.callbacks = callbacks;
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

  handleSuggestionSelect = (index: number) => {
    if (this.strValue !== this.startSymbol || this.filteredTags.length) {
      if (
        index === 0 &&
        !this.currentTagMatch &&
        !this.hasTag &&
        this.strValue !== this.startSymbol
      ) {
        this.createNewTag(this.strValue);
        return;
      }

      if (!this.hasTag || index > 0) {
        const hasFirstItem = !this.currentTagMatch || this.hasTag

        this.addTag(
          this.filteredTags[hasFirstItem ? index - 1 : index]
        );
      }
    }
  };

  toggleSuggestion = () => {
    this.showSuggestions = !this.showSuggestions;
  }

  suggestionsMenu = new TaskQuickEditorSuggestionsMenu({
    onSelect: this.handleSuggestionSelect,
    onOpen: (isOpen: boolean) => null,
  });
}

export const {
  StoreProvider: TaskAddTagModalStoreProvider,
  useStore: useTaskAddTagModalStore,
} = getProvider(TaskAddTagModalStore);
