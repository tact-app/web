import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { SpaceData } from '../../types';
import { SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getRandomOrigins } from './stubs';
import { colors } from '../../constants';

export type SpaceCreationModalProps = {
  callbacks: {
    onClose?: () => void;
    onSave?: (space: SpaceData) => void;
    onDelete?: (spaceId: string) => void;
  };
  editMode?: boolean;
  space?: SpaceData;
};

export class SpaceCreationModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  hotkeyHandlers = {
    CREATE: (e) => {
      e.preventDefault();
      this.handleSave();
    },
    BACK: () => {
      this.handleBack();
    },
    CANCEL: () => {
      this.handleClose();
    },
  };

  callbacks: SpaceCreationModalProps['callbacks'] = {};

  isOpen = true;
  isColorPickerOpen = false;
  isDescriptionLoading: boolean = true;
  isEditMode: boolean = false;

  selectedAccountId: string = this.root.user.data.accounts[0].id;
  existedSpace: SpaceData | null = null;
  icon: string = '';
  color = colors[Math.floor(Math.random() * colors.length)];
  name: string = '';
  shortName: string = '';
  shortNameChanged: boolean = false;
  isDeleteConfirmationOpen: boolean = false;

  get isReadyForSave() {
    return !!this.name;
  }

  openConfirmationDelete = () => {
    this.isDeleteConfirmationOpen = true;
  };

  closeDeleteConfirmation = () => {
    this.isDeleteConfirmationOpen = false;
  };

  confirmDeletion = () => {
    this.isDeleteConfirmationOpen = false;

    this.root.resources.spaces.delete(this.existedSpace.id);
    this.callbacks.onDelete?.(this.existedSpace.id);
  };

  handleColorSelect = (color: string) => {
    this.color = color;
  };

  handleAccountSelect = (id: string) => {
    this.selectedAccountId = id;
  };

  handleShortNameChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.shortName = e.currentTarget.value;
    this.shortNameChanged = true;
  };

  handleNameChange = (e: SyntheticEvent) => {
    this.name = (e.target as HTMLInputElement).value;

    if (!this.name) {
      this.shortName = '';
      this.shortNameChanged = false;
    }

    if (!this.shortNameChanged) {
      this.shortName = this.name.slice(0, 1).toUpperCase();
    }
  };

  handleBack = () => {
    this.handleClose();
  };

  handleClose = () => {
    if (!this.isColorPickerOpen) {
      this.isOpen = false;
    } else {
      this.closeColorPicker();
    }
  };

  handleCloseComplete = () => {
    this.callbacks.onClose?.();
  };

  openColorPicker = () => {
    this.isColorPickerOpen = true;
  };

  closeColorPicker = () => {
    this.isColorPickerOpen = false;
  };

  handleSave = () => {
    if (this.isReadyForSave) {
      const id = this.existedSpace ? this.existedSpace.id : uuidv4();

      if (this.existedSpace) {
        this.root.resources.spaces.update({
          id,
          name: this.name,
          shortName: this.shortName,
          color: this.color,
        });

        this.callbacks.onSave?.(this.existedSpace);
      } else {
        const newSpace: SpaceData = {
          id,
          name: this.name,
          type: 'private',
          shortName: this.shortName,
          color: this.color,
          children: getRandomOrigins(id, 3),
        };

        this.root.resources.spaces.add(newSpace);

        this.callbacks.onSave?.(newSpace);
      }

      this.handleClose();
    }
  };

  update = async (props: SpaceCreationModalProps) => {
    this.callbacks = props.callbacks;
    this.existedSpace = props.space;
    this.isEditMode = props.editMode;

    if (this.existedSpace) {
      this.color = this.existedSpace.color;
      this.name = this.existedSpace.name;
      this.shortName = this.existedSpace.shortName;
      this.shortNameChanged = true;
    } else {
      runInAction(() => {
        this.isDescriptionLoading = false;
      });
    }
  };
}

export const {
  StoreProvider: SpaceCreationModalStoreProvider,
  useStore: useSpaceCreationModalStore,
} = getProvider(SpaceCreationModalStore);
