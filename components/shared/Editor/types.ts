import { ChainedCommands, Editor, JSONContent } from '@tiptap/core';
import { FC } from 'react';
import { PlusIcon } from '../Icons/PlusIcon';
import {
  insertMetric,
  MetricExtensionTypes,
} from './extensions/MetricExtension/command';

export enum BlockValues {
  PARAGRAPH = 'paragraph',
  HEADING = 'heading',
  ORDERED_LIST = 'orderedList',
  BULLET_LIST = 'bulletList',
}

export type BlockTypesOption = {
  icon: FC;
  label: string;
  command: (chain: ChainedCommands, editor: Editor) => ChainedCommands;
};

export const BlockTypesOptions: BlockTypesOption[] = [
  {
    icon: PlusIcon,
    label: 'Paragraph',
    command: (chain) => chain.setNode(BlockValues.PARAGRAPH),
  },
  {
    icon: PlusIcon,
    label: 'Heading 1',
    command: (chain) => chain.setNode(BlockValues.HEADING, { level: 1 }),
  },
  {
    icon: PlusIcon,
    label: 'Heading 2',
    command: (chain) => chain.setNode(BlockValues.HEADING, { level: 2 }),
  },
  {
    icon: PlusIcon,
    label: 'Heading 3',
    command: (chain) => chain.setNode(BlockValues.HEADING, { level: 3 }),
  },
  {
    icon: PlusIcon,
    label: 'Ordered list',
    command: (chain) => chain.toggleOrderedList(),
  },
  {
    icon: PlusIcon,
    label: 'Bullet list',
    command: (chain) => chain.toggleBulletList(),
  },
  {
    icon: PlusIcon,
    label: 'Task list',
    command: (chain) => chain.toggleTaskList(),
  },
  {
    icon: PlusIcon,
    label: 'Percent metric',
    command: (chain, editor) =>
      insertMetric(MetricExtensionTypes.RING, editor, chain).chain,
  },
  {
    icon: PlusIcon,
    label: 'Boolean metric',
    command: (chain, editor) =>
      insertMetric(MetricExtensionTypes.TODO, editor, chain).chain,
  },
  {
    icon: PlusIcon,
    label: 'Target metric',
    command: (chain, editor) =>
      insertMetric(MetricExtensionTypes.NUMBER, editor, chain).chain,
  },
];

export type Block<T> = {
  id: string;
  type: T;
  content: JSONContent;
};

export type Blocks =
  | Block<BlockValues.PARAGRAPH>
  | Block<BlockValues.HEADING>
  | Block<BlockValues.ORDERED_LIST>
  | Block<BlockValues.BULLET_LIST>;
