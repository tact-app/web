import { JSONContent } from '@tiptap/core';
import { PlusIcon } from '../../pages/Inbox/components/TaskIcons/PlusIcon';
import { ReactComponent } from 'react-hotkeys';

export enum BlockValues {
  PARAGRAPH = 'paragraph',
  HEADING = 'heading',
  ORDERED_LIST = 'orderedList',
  BULLET_LIST = 'bulletList',
}

export enum BlockTypes {
  TEXT = 'text',
  METRIC = 'metric',
}

export type BlockTypesOption = {
  icon: ReactComponent,
  label: string,
  type: BlockTypes,
  value: BlockValues,
  config?: any,
}

export const BlockTypesOptions: BlockTypesOption[] = [
  {
    icon: PlusIcon,
    label: 'Paragraph',
    type: BlockTypes.TEXT,
    value: BlockValues.PARAGRAPH,
  },
  {
    icon: PlusIcon,
    label: 'Heading 1',
    type: BlockTypes.TEXT,
    value: BlockValues.HEADING,
    config: { level: 1 },
  },
  {
    icon: PlusIcon,
    label: 'Heading 2',
    type: BlockTypes.TEXT,
    value: BlockValues.HEADING,
    config: { level: 2 },
  },
  {
    icon: PlusIcon,
    label: 'Heading 3',
    type: BlockTypes.TEXT,
    value: BlockValues.HEADING,
    config: { level: 3 },
  },
  {
    icon: PlusIcon,
    label: 'Ordered list',
    type: BlockTypes.TEXT,
    value: BlockValues.ORDERED_LIST,
  },
  {
    icon: PlusIcon,
    label: 'Bullet list',
    type: BlockTypes.TEXT,
    value: BlockValues.BULLET_LIST,
  },
];

export type Block<T> = {
  id: string;
  type: T;
  content: JSONContent;
}

export type Blocks =
  | Block<BlockValues.PARAGRAPH>
  | Block<BlockValues.HEADING>
  | Block<BlockValues.ORDERED_LIST>
  | Block<BlockValues.BULLET_LIST>