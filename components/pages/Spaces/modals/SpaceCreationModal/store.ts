import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { SpaceData } from '../../types';
import { SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type SpaceCreationModalProps = {
  onClose: () => void;
  onSave: (goal: SpaceData) => void;
  editMode?: boolean;
  space?: SpaceData;
};

export const colors = [
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
];

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

  onClose: SpaceCreationModalProps['onClose'];
  onSave: SpaceCreationModalProps['onSave'];

  isOpen = true;
  isColorPickerOpen = false;
  isDescriptionLoading: boolean = true;
  isEditMode: boolean = false;
  existedSpace: SpaceData | null = null;
  icon: string = '';
  color = colors[Math.floor(Math.random() * colors.length)];
  name: string = '';
  shortName: string = '';

  get isReadyForSave() {
    return !!this.name;
  }

  handleColorSelect = (color: string) => {
    this.color = color;
  };

  handleNameChange = (e: SyntheticEvent) => {
    this.name = (e.target as HTMLInputElement).value;
    this.shortName = this.name.slice(0, 1).toUpperCase();
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
    this.onClose?.();
  };

  openColorPicker = () => {
    this.isColorPickerOpen = true;
  };

  closeColorPicker = () => {
    this.isColorPickerOpen = false;
  };

  handleSave = () => {
    if (this.isReadyForSave) {
      this.onSave?.({
        id: this.existedSpace ? this.existedSpace.id : uuidv4(),
        name: this.name,
        shortName: this.shortName,
        color: this.color,
        children: [
          {
            id: uuidv4(),
            name: 'Jira',
            children: [
              {
                id: uuidv4(),
                name: 'Project 1',
              },
              {
                id: uuidv4(),
                name: 'Project 2',
              },
            ],
          },
        ],
      });

      this.handleClose();
    }
  };

  update = async (props: SpaceCreationModalProps) => {
    this.onClose = props.onClose;
    this.onSave = props.onSave;
    this.existedSpace = props.space;
    this.isEditMode = props.editMode;

    if (this.existedSpace) {
      this.color = this.existedSpace.color;
      this.name = this.existedSpace.name;
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
