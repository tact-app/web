import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { GoalCreationModalSteps } from './types';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalData, GoalIconVariants, GoalTemplateData } from '../../types';
import { GoalCreationModalStepsOrder } from './constants';
import { SyntheticEvent } from 'react';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { init } from 'emoji-mart';

export type GoalCreationModalProps = {
  onClose: () => void,
  onCreate: (goal: GoalData) => void,
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
    CREATE: () => {
      if (this.isReadyForSave) {
        this.handleCreate();
      }
    },
    BACK: () => {
      this.handleBack();
    }
  };

  onClose: GoalCreationModalProps['onClose'];
  onCreate: GoalCreationModalProps['onCreate'];

  icon: string = '';
  color = colors[0];
  title: string = '';
  description: JSONContent = {
    'type': 'doc',
    'content': []
  };
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

    if (currentStepIndex > 0) {
      this.step = GoalCreationModalStepsOrder[currentStepIndex - 1];
    } else {
      this.handleClose();
    }
  };

  handleClose = () => {
    this.onClose?.();
  };

  handleCreate = () => {
    this.onCreate?.({
      id: uuidv4(),
      listId: 'default',
      title: this.title,
      description: this.description,
      icon: {
        type: GoalIconVariants.EMOJI,
        color: this.color,
        value: this.icon,
      }
    });

    this.handleClose();
  };

  handleDescriptionChange = (value: JSONContent) => {
    this.description = value;
  };

  selectTemplate = (template: GoalTemplateData | null) => {
    this.currentTemplate = template;
    this.step = GoalCreationModalSteps.FILL_DESCRIPTION;
  };

  init = (props: GoalCreationModalProps) => {
    this.onClose = props.onClose;
    this.onCreate = props.onCreate;
  };
}

export const {
  StoreProvider: GoalCreationModalStoreProvider,
  useStore: useGoalCreationModalStore,
} = getProvider(GoalCreationModalStore);
