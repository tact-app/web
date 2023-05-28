import { KeyboardEvent, SyntheticEvent } from 'react';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../stores/RootStore';
import { getProvider } from '../../../helpers/StoreProvider';
import { ModalsController } from '../../../helpers/ModalsController';
import { SpaceCreationModal } from '../../pages/Spaces/modals/SpaceCreationModal';
import { ModalsTypes } from '../TasksList/modals/store';
import { SpaceData } from '../../pages/Spaces/types';
import { NavigationDirections } from '../../../types/navigation';
import { ListNavigation } from '../../../helpers/ListNavigation';
import { NavigationHelper } from '../../../helpers/NavigationHelper';

export type SpaceSelectProps = {
  onChange(spaceId: string, isNew?: boolean): void;
  onNavigate?(direction: NavigationDirections, event: KeyboardEvent): void;
  onNavigateToSpace?(spaceId: string): void;
  onCreateModalOpened?(isOpened: boolean): void;
  selectedId?: string | null;
};

export class SpaceSelectStore {
  callbacks: Pick<SpaceSelectProps, 'onChange' | 'onNavigate' | 'onNavigateToSpace' | 'onCreateModalOpened'>;

  triggerRef: HTMLButtonElement | null = null;
  goToSpaceButtonRef: HTMLButtonElement | null = null;
  isTriggerFocused: boolean = false;
  isGoToSpaceButtonFocused: boolean = false;
  isMenuOpen: boolean = false;
  isCreateModalOpened: boolean = false;
  selectedSpaceId: string | null = null;

  menuNavigation = new ListNavigation();

  setTriggerFocusTimeout: NodeJS.Timeout;

  controller = new ModalsController({
    [ModalsTypes.SPACE_CREATION]: SpaceCreationModal,
  });

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.menuNavigation.disable();
  }

  get spaces() {
    return this.root.resources.spaces.list.filter((space) => space.type !== 'all');
  }

  get selectedSpace() {
    const space = this.root.resources.spaces.list.find(
      (space) => space.id === this.selectedSpaceId
    );

    return {
      ...space,
      hoverColor: `${space.color}.100`,
    };
  }

  handleSuggestionSelect(id: string) {
    this.selectedSpaceId = id;

    this.callbacks.onChange(id);

    this.closeMenu();
    this.triggerRef.focus();
  };

  setTriggerFocus = () => {
    this.setTriggerFocusTimeout = setTimeout(() => {
      this.triggerRef.focus();
    });
  };

  handleCloseCreateModal = () => {
    this.controller.close();
    this.menuNavigation.enable();
    this.isCreateModalOpened = false;
    this.callbacks?.onCreateModalOpened?.(false);
    this.setTriggerFocus();
  };

  handleCreate() {
    this.closeMenu();
    this.menuNavigation.disable();
    this.isCreateModalOpened = true;
    this.callbacks?.onCreateModalOpened?.(true);

    this.controller.open({
      type: ModalsTypes.SPACE_CREATION,
      props: {
        callbacks: {
          onSave: (space: SpaceData) => {
            this.root.api.spaces.add(space);
            this.selectedSpaceId = space.id;
            this.callbacks.onChange(space.id, true);

            this.handleCloseCreateModal();
          },
          onClose: this.handleCloseCreateModal,
        },
      },
    });
  };

  openMenu() {
    this.isMenuOpen = true;

    this.menuNavigation.reset();
    this.menuNavigation.enable();
  };

  closeMenu() {
    this.isMenuOpen = false;

    this.menuNavigation.reset();
    this.menuNavigation.disable();
  };

  setTriggerRef(el: HTMLButtonElement) {
    this.triggerRef = el;
  };

  setGoToSpaceButtonRef(el: HTMLButtonElement) {
    this.goToSpaceButtonRef = el;
  };

  goToSpace(e: SyntheticEvent) {
    e.stopPropagation();

    if (this.callbacks.onNavigateToSpace) {
      this.callbacks.onNavigateToSpace(this.selectedSpaceId);
    } else {
      this.root.router.push(`/inbox/${this.selectedSpaceId}`);
    }
  };

  handleTriggerFocus = () => {
    this.isTriggerFocused = true;
  };

  handleTriggerBlur = () => {
    this.isTriggerFocused = false;
  };

  handleGoToSpaceButtonFocus = () => {
    this.isGoToSpaceButtonFocused = true;
  };

  handleGoToSpaceButtonBlur = () => {
    this.isGoToSpaceButtonFocused = false;
  };

  handleTriggerButtonKeyDown = (event: KeyboardEvent) => {
    const direction = NavigationHelper.castKeyToDirection(event.key, event.shiftKey);

    if (direction === NavigationDirections.ENTER && this.isGoToSpaceButtonFocused) {
      this.goToSpaceButtonRef?.click();
    } else if (direction === NavigationDirections.INVARIANT) {
      this.closeMenu();

      if (!this.isMenuOpen) {
        this.triggerRef?.focus();
      } else {
        this.triggerRef?.blur();
      }

      this.callbacks?.onNavigate?.(direction, event);
    } else if (!this.isMenuOpen) {
      if (direction === NavigationDirections.RIGHT && !this.isGoToSpaceButtonFocused) {
        this.goToSpaceButtonRef?.focus();
      } else {
        this.callbacks?.onNavigate?.(direction, event)
      }
    }
  };

  handleGoToSpaceButtonKeyDown = (event: KeyboardEvent) => {
    const direction = NavigationHelper.castKeyToDirection(event.key, event.shiftKey);

    if (direction === NavigationDirections.INVARIANT) {
      this.goToSpaceButtonRef?.blur();
    } else if (direction === NavigationDirections.LEFT && !this.isTriggerFocused) {
      this.triggerRef?.focus();
    } else {
      this.callbacks?.onNavigate?.(direction, event);
    }
  };

  handleContainerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();

      if (this.isMenuOpen) {
        this.triggerRef?.focus();
      } else {
        this.triggerRef?.blur();
      }

      this.closeMenu();
    }
  };

  destroy = () => {
    clearTimeout(this.setTriggerFocusTimeout);
  };

  update({ onChange, onNavigate, onNavigateToSpace, onCreateModalOpened, selectedId }: SpaceSelectProps) {
    this.callbacks = { onChange, onNavigate, onNavigateToSpace, onCreateModalOpened };
    this.selectedSpaceId = selectedId;

    if (!this.selectedSpaceId) {
      const defaultSpace = this.root.resources.spaces.list.find(
        (space) => space.type === 'personal'
      );
      this.selectedSpaceId = defaultSpace.id;
      this.callbacks.onChange(defaultSpace.id);
    }
  };
}

export const {
  useStore: useSpaceSelectStore,
  StoreProvider: SpaceSelectStoreProvider
} = getProvider(SpaceSelectStore);
