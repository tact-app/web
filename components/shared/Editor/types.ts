import { ChainedCommands, Editor } from '@tiptap/core';
import { FC } from 'react';

export type BlockTypesOption = {
  name: string;
  options: {
    type: 'command';
    icon: FC;
    label: string;
    command: (chain: ChainedCommands, editor: Editor) => ChainedCommands;
  }[];
};
