import { JSONContent } from '@tiptap/core';

export enum GoalIconVariants {
  EMOJI = 'emoji',
  IMAGE = 'image',
}

export type GoalData = {
  id: string,
  title: string,
  listId: string,
  description?: JSONContent,
  icon?: {
    type: GoalIconVariants.EMOJI,
    value: string,
    color: string,
  } | {
    type: GoalIconVariants.IMAGE,
    color: string,
    url: string,
  },
}

export type GoalTemplateIcon = {
  type: GoalIconVariants.EMOJI
  content: string
}

export type GoalTemplateData = {
  id: string,
  title: string,
  description: JSONContent,
  icon: GoalTemplateIcon,
}
