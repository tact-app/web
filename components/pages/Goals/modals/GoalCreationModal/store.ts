import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { GoalCreationModalSteps } from './types';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalData, GoalIconVariants, GoalTemplateData } from '../../types';
import { GoalCreationModalStepsOrder } from './constants';
import { SyntheticEvent } from 'react';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { init } from 'emoji-mart';
import { DescriptionData } from '../../../../../types/description';

export type GoalCreationModalProps = {
  onClose: () => void;
  onSave: (goal: GoalData, description?: DescriptionData) => void;
  editMode?: boolean;
  goal?: GoalData;
};

export const colors = [
  'red.200',
  'orange.100',
  'orange.200',
  'yellow.200',
  'green.200',
  'blue.200',
  'teal.200',
  'purple.200',
];

export class GoalCreationModalStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);

    init({
      data: async () => {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
        );

        return response.json();
      },
    });
  }

  hotkeyHandlers = {
    CREATE: (e) => {
      e.preventDefault();
      if (this.isReadyForSave) {
        this.handleSave();
      }
    },
    BACK: () => {
      this.handleBack();
    },
    CANCEL: () => {
      this.handleClose();
    },
  };

  onClose: GoalCreationModalProps['onClose'];
  onSave: GoalCreationModalProps['onSave'];

  isOpen = true;
  isEmojiPickerOpen = false;
  isDescriptionLoading: boolean = true;
  isEditMode: boolean = false;
  existedGoal: GoalData | null = null;
  icon: string = '';
  color = colors[0];
  title: string = '';
  description?: DescriptionData = undefined;
  currentTemplate: null | GoalTemplateData = null;
  templates: GoalTemplateData[] = [];
  step: GoalCreationModalSteps = GoalCreationModalSteps.SELECT_TEMPLATE;

  get isReadyForSave() {
    return !!this.title;
  }

  openEmojiPicker = () => {
    this.isEmojiPickerOpen = true;
  };

  closeEmojiPicker = () => {
    this.isEmojiPickerOpen = false;
  };

  handleEmojiSelect = (emoji: { native: string }) => {
    this.icon = emoji.native;
  };

  handleColorSelect = (color: string) => {
    this.color = color;
  };

  handleTitleChange = (e: SyntheticEvent) => {
    this.title = (e.target as HTMLInputElement).value;
  };

  handleBack = () => {
    const currentStepIndex = GoalCreationModalStepsOrder.indexOf(this.step);

    if (!this.isEmojiPickerOpen) {
      if (currentStepIndex > 0 && !this.isEditMode) {
        this.step = GoalCreationModalStepsOrder[currentStepIndex - 1];
      } else {
        this.handleClose();
      }
    } else {
      this.closeEmojiPicker();
    }
  };

  handleClose = () => {
    if (!this.isEmojiPickerOpen) {
      this.isOpen = false;
    } else {
      this.closeEmojiPicker();
    }
  };

  handleCloseComplete = () => {
    this.onClose?.();
  };

  handleSave = () => {
    this.onSave?.(
      {
        id: this.existedGoal ? this.existedGoal.id : uuidv4(),
        listId: 'default',
        title: this.title,
        descriptionId: this.description.id,
        icon: {
          type: GoalIconVariants.EMOJI,
          color: this.color,
          value: this.icon,
        },
      },
      this.description
    );

    this.handleClose();
  };

  handleDescriptionChange = (value: JSONContent) => {
    if (!this.description) {
      this.description = {
        id: uuidv4(),
        content: value,
      };
    }

    this.description.content = value;
  };

  selectTemplate = (template: GoalTemplateData | null) => {
    this.currentTemplate = template;
    this.step = GoalCreationModalSteps.FILL_DESCRIPTION;
  };

  update = async (props: GoalCreationModalProps) => {
    this.onClose = props.onClose;
    this.onSave = props.onSave;
    this.existedGoal = props.goal;
    this.isEditMode = props.editMode;

    if (this.isEditMode) {
      this.step = GoalCreationModalSteps.FILL_DESCRIPTION;
    }

    if (this.existedGoal) {
      this.icon = this.existedGoal.icon.value;
      this.color = this.existedGoal.icon.color;
      this.title = this.existedGoal.title;

      if (this.existedGoal.descriptionId) {
        this.isDescriptionLoading = true;
        const description =
          (await this.root.api.descriptions.get(
            this.existedGoal.descriptionId
          )) || undefined;

        runInAction(() => {
          this.description = description;
          this.isDescriptionLoading = false;
        });
      }
    } else {
      runInAction(() => {
        this.isDescriptionLoading = false;
      });
    }
  };
}

export const {
  StoreProvider: GoalCreationModalStoreProvider,
  useStore: useGoalCreationModalStore,
} = getProvider(GoalCreationModalStore);
