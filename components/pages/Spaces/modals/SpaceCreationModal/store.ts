import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { SpaceData } from '../../types';
import { SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EMOJI_SELECT_COLORS } from "../../../../shared/EmojiSelect/constants";
import { GlobalHooks } from '../../../../../helpers/GlobalHooksHelper';

export type SpaceCreationModalProps = {
  callbacks: {
    onClose?: () => void;
    onSave?: (space: SpaceData) => void;
    onDelete?: (spaceId: string) => void;
    openSpaceСonnectionsModal?: () => void;
    onConnect?: (space: SpaceData) => void;
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

  globalHook = {
    [GlobalHooks.MetaEnter]: () => {
      this.handleSave();
    }
  };

  callbacks: SpaceCreationModalProps['callbacks'] = {};

  isOpen: boolean = true;
  isEmojiPickerOpen: boolean = false;
  isСongratulationsModal: boolean = false;
  isDescriptionLoading: boolean = true;
  isEditMode: boolean = false;

  descriptionLimit: number = 200;
  selectedAccountId: string = this.root.user.data.accounts[0].id;
  existedSpace: SpaceData | null = null;
  newSpace: SpaceData | null = null;
  icon: string = '';
  color = EMOJI_SELECT_COLORS[Math.floor(Math.random() * EMOJI_SELECT_COLORS.length)];
  name: string = '';
  description: string = '';
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

  handleRemoveEmoji = () => {
    this.icon = ''
  }

  handleEmojiSelect = (emoji: string) => {
    this.icon = emoji;
  };

  handleNameChange = (e: SyntheticEvent) => {
    this.name = (e.target as HTMLInputElement).value;
  };

  handleDescriptionChange = (e: SyntheticEvent) => {
    this.description = (e.target as HTMLInputElement).value;
  };

  handleBack = () => {
    this.handleClose();
  };

  handleClose = () => {
    if (!this.isEmojiPickerOpen) {
      this.isOpen = false;
      if (this.isСongratulationsModal) {
        this.isСongratulationsModal = false
      }
    } else {
      this.closeEmojiPicker();
    }
  };

  handleCloseComplete = () => {
    this.callbacks.onClose?.();
  };

  openEmojiPicker = () => {
    this.isEmojiPickerOpen = true;
  };

  closeEmojiPicker = () => {
    this.isEmojiPickerOpen = false;
  };

  handleSave = () => {
    if (this.isReadyForSave) {
      const id = this.existedSpace ? this.existedSpace.id : uuidv4();

      if (this.existedSpace) {
        this.root.resources.spaces.update({
          id,
          name: this.name,
          description: this.description,
          color: this.color,
          icon: this.icon,
        });

        this.callbacks.onSave?.(this.existedSpace);
        this.handleClose();
      } else {
        const newSpace: SpaceData = {
          id,
          name: this.name,
          description: this.description,
          color: this.color,
          icon: this.icon,
          type: 'private',
          children: [],
        };

        this.root.resources.spaces.add(newSpace);
        this.callbacks.onSave?.(newSpace);
        this.newSpace = newSpace
        if (this.callbacks?.onConnect) {
          this.isСongratulationsModal = true
        } else {
          this.handleClose();
        }
      }
    }
  };

  handelConnect = () => {
    this.callbacks.onConnect(this.newSpace)
  }

  update = async (props: SpaceCreationModalProps) => {
    this.callbacks = props.callbacks;
    this.existedSpace = props.space;
    this.isEditMode = props.editMode;

    if (this.existedSpace) {
      this.name = this.existedSpace.name;
      this.description = this.existedSpace.description;
      this.color = this.existedSpace.color;
      this.icon = this.existedSpace.icon;
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
