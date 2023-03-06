import React, { KeyboardEvent } from 'react';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from "../../../helpers/StoreProvider";
import { ModalsController } from "../../../helpers/ModalsController";
import { TaskDeleteModal } from "../TasksList/modals/TaskDeleteModal";
import { TaskWontDoModal } from "../TasksList/modals/TaskWontDoModal";
import { TaskGoalAssignModal } from "../TasksList/modals/TaskGoalAssignModal";
import { GoalCreationModal } from "../../pages/Goals/modals/GoalCreationModal";
import { TaskSpaceChangeModal } from "../TasksList/modals/TaskSpaceChangeModal";
import { SpaceCreationModal } from "../../pages/Spaces/modals/SpaceCreationModal";
import { ModalsTypes } from "../TasksList/modals/store";
import { SpaceData } from "../../pages/Spaces/types";
import { NavigationDirections } from "../../../types/navigation";

export type SpaceSelectProps = {
  onChange(spaceId: string): void;
  onNavigate?(direction: NavigationDirections): void;
  selectedId?: string | null;
}

export class SpaceSelectStore {
  callbacks: Pick<SpaceSelectProps, 'onChange' | 'onNavigate'>;

  buttonContainerRef: HTMLButtonElement | null = null;
  menuRef: HTMLDivElement | null = null;
  scrollTimeout: NodeJS.Timeout;
  isMenuOpen = false;
  selectedSpaceId: string | null = null;
  hoveredIndex: number = 0;

  controller = new ModalsController({
    [ModalsTypes.SPACE_CREATION]: SpaceCreationModal,
  });

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get spaces() {
    return this.root.resources.spaces.list.filter((space) => space.type !== 'all');
  }

  get spacesExtended() {
    return this.spaces.map((space) => ({
      ...space,
      isSelected: space.id === this.selectedSpaceId,
    }));
  }

  get selectedSpace() {
    const space = this.root.resources.spaces.list.find(
      (space) => space.id === this.selectedSpaceId
    );

    return {
      ...space,
      hoverColor: space.color + '.75'
    };
  }

  update({ onChange, onNavigate, selectedId }: SpaceSelectProps) {
    this.callbacks = { onChange, onNavigate };
    this.selectedSpaceId = selectedId;

    if (!this.selectedSpaceId) {
      const defaultSpace = this.root.resources.spaces.list.find(
        (space) => space.type === 'personal'
      );
      this.selectedSpaceId = defaultSpace.id;
      this.callbacks.onChange(defaultSpace.id);
    }
  };

  destroy() {
    clearTimeout(this.scrollTimeout);
  }

  handleSuggestionSelect(id: string) {
    this.selectedSpaceId = id;

    this.callbacks.onChange(id);
    this.toggleMenu();
  };

  handleClickOutside() {
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
  }

  handleButtonContainerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (!this.isMenuOpen) {
      return;
    }

    if (e.key === 'Escape') {
      this.toggleMenu();
    } else if (e.key === 'ArrowDown') {
      this.nextHoveredIndex();
    } else if (e.key === 'ArrowUp') {
      this.prevHoveredIndex();
    }
  }

  setIndex(index: number) {
    this.hoveredIndex = index;

    this.scrollTimeout = setTimeout(() => {
      this.menuRef.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  nextHoveredIndex() {
    if (this.hoveredIndex < this.spaces.length - 1) {
      this.setIndex(this.hoveredIndex + 1);
    } else {
      this.setIndex(0);
    }
  };

  prevHoveredIndex() {
    if (this.hoveredIndex > 0) {
      this.setIndex(this.hoveredIndex - 1);
    } else {
      this.setIndex(this.spaces.length - 1);
    }
  };

  handleCreate() {
    this.toggleMenu();

    this.controller.open({
      type: ModalsTypes.SPACE_CREATION,
      props: {
        callbacks: {
          onSave: (space: SpaceData) => {
            this.root.api.spaces.add(space);
            this.controller.close();
            this.selectedSpaceId = space.id;
            this.callbacks.onChange(space.id);
          },
          onClose: () => {
            this.controller.close();
          },
        },
      },
    });
  }

  focus() {
    this.buttonContainerRef?.focus();
  };

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setButtonContainerRef(el: HTMLButtonElement) {
    this.buttonContainerRef = el;
  }

  setMenuRef(el: HTMLDivElement) {
    this.menuRef = el;
  }
}

export const {
  useStore: useSpaceSelectStore,
  StoreProvider: SpaceSelectStoreProvider
} = getProvider(SpaceSelectStore);
