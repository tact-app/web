import { JSONContent } from '@tiptap/core';

export enum GoalIconVariants {
  EMOJI = 'emoji',
  IMAGE = 'image',
}

export type GoalIconData =
  | {
      type: GoalIconVariants.EMOJI;
      value: string;
      color: string;
    }
  | {
      type: GoalIconVariants.IMAGE;
      color: string;
      value: string;
    };

export type GoalData = {
  id: string;
  title: string;
  listId: string;
  startDate: string;
  targetDate: string;
  spaceId: string;
  descriptionId?: string;
  icon?: GoalIconData;
};

export type GoalTemplateIcon = {
  type: GoalIconVariants.EMOJI;
  content: string;
};

export type GoalTemplateData = {
  id: string;
  title: string;
  description: JSONContent;
  icon: GoalTemplateIcon;
};
