import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { GoalCreationModalSteps } from './types';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalData, GoalDescriptionData, GoalIconVariants, GoalTemplateData } from '../../types';
import { GoalCreationModalStepsOrder } from './constants';
import { SyntheticEvent } from 'react';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { init } from 'emoji-mart';

export type GoalCreationModalProps = {
  onClose: () => void,
  onSave: (goal: GoalData, description?: GoalDescriptionData) => void,
  editMode?: boolean,
  goal?: GoalData,
}

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
          'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
        );

        return response.json();
      }
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
    }
  };

  onClose: GoalCreationModalProps['onClose'];
  onSave: GoalCreationModalProps['onSave'];

  isDescriptionLoading: boolean = true;
  isEditMode: boolean = false;
  existedGoal: GoalData | null = null;
  icon: string = '';
  color = colors[0];
  title: string = '';
  description?: GoalDescriptionData = undefined;
  currentTemplate: null | GoalTemplateData = null;
  templates: GoalTemplateData[] = [];
  step: GoalCreationModalSteps = GoalCreationModalSteps.SELECT_TEMPLATE;

  get isReadyForSave() {
    return !!this.title;
  }

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

    if (currentStepIndex > 0 && !this.isEditMode) {
      this.step = GoalCreationModalStepsOrder[currentStepIndex - 1];
    } else {
      this.handleClose();
    }
  };

  handleClose = () => {
    this.onClose?.();
  };

  handleSave = () => {
    this.onSave?.({
      id: this.existedGoal ? this.existedGoal.id : uuidv4(),
      listId: 'default',
      title: this.title,
      descriptionId: this.description.id,
      icon: {
        type: GoalIconVariants.EMOJI,
        color: this.color,
        value: this.icon,
      }
    }, this.description);

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

  init = async (props: GoalCreationModalProps) => {
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
        const description = (await this.root.api.descriptions.get(this.existedGoal.descriptionId)) || undefined;

        runInAction(() => {
          console.log('init', description);
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
