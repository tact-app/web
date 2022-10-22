import { makeAutoObservable } from 'mobx';

export class TaskQuickEditorSuggestionsMenu {
  constructor(props: {
    onSelect: (index: number) => void;
    onOpen: (state: boolean) => void;
  }) {
    makeAutoObservable(this);

    this.onSelect = props.onSelect;
    this.onOpen = props.onOpen;
  }

  onSelect: (index: number) => void;
  onOpen: (state: boolean) => void;

  isOpen: boolean = false;
  itemRef: HTMLButtonElement | null = null;
  itemsCount: number = 0;
  hoveredIndex: number = 0;

  open = () => {
    this.isOpen = true;
    this.onOpen(true);
  };

  close = () => {
    this.isOpen = false;
    this.itemsCount = 0;
    this.hoveredIndex = 0;
    this.onOpen(false);
  };

  setCount(count: number, newHoveredIndex?: number) {
    this.itemsCount = count;

    if (newHoveredIndex !== undefined) {
      this.hoveredIndex = newHoveredIndex;
    } else {
      this.hoveredIndex = 0;
    }
  }

  setIndex(index: number) {
    this.hoveredIndex = index;
  }

  next = () => {
    console.log('next', this.hoveredIndex, this.itemsCount);
    if (this.hoveredIndex < this.itemsCount - 1) {
      this.hoveredIndex += 1;
    } else {
      this.hoveredIndex = 0;
    }
  };

  prev = () => {
    if (this.hoveredIndex > 0) {
      this.hoveredIndex -= 1;
    } else {
      this.hoveredIndex = this.itemsCount - 1;
    }
  };

  commit = () => {
    if (this.itemRef) {
      this.itemRef.click();
    }
  };

  setRef = (el: HTMLButtonElement) => {
    this.itemRef = el;
  };
}
