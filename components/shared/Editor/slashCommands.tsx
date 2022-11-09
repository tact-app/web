import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faH1,
  faH2,
  faH3,
  faInputNumeric,
  faListCheck,
  faListOl,
  faListUl,
  faParagraph,
  faPercent,
  faSquareCheck,
} from '@fortawesome/pro-regular-svg-icons';
import {
  insertMetric,
  MetricExtensionTypes,
} from './extensions/MetricExtension/command';
import { BlockTypesOption } from './types';

export enum BlockValues {
  PARAGRAPH = 'paragraph',
  HEADING = 'heading',
  ORDERED_LIST = 'orderedList',
  BULLET_LIST = 'bulletList',
}

export const BlockTypesOptions: BlockTypesOption[] = [
  {
    name: 'Text',
    options: [
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faParagraph} />,
        type: 'command',
        label: 'Paragraph',
        command: (chain) => chain.setNode(BlockValues.PARAGRAPH),
      },
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faH1} />,
        type: 'command',
        label: 'Heading 1',
        command: (chain) => chain.setNode(BlockValues.HEADING, { level: 1 }),
      },
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faH2} />,
        type: 'command',
        label: 'Heading 2',
        command: (chain) => chain.setNode(BlockValues.HEADING, { level: 2 }),
      },
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faH3} />,
        type: 'command',
        label: 'Heading 3',
        command: (chain) => chain.setNode(BlockValues.HEADING, { level: 3 }),
      },
    ],
  },
  {
    name: 'Lists',
    options: [
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faListOl} />,
        type: 'command',
        label: 'Ordered list',
        command: (chain) => chain.toggleOrderedList(),
      },
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faListUl} />,
        type: 'command',
        label: 'Bullet list',
        command: (chain) => chain.toggleBulletList(),
      },
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faListCheck} />,
        type: 'command',
        label: 'Task list',
        command: (chain) => chain.toggleTaskList(),
      },
    ],
  },
  {
    name: 'Metrics',
    options: [
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faPercent} />,
        type: 'command',
        label: 'Percentage target',
        command: (chain, editor) =>
          insertMetric(MetricExtensionTypes.RING, editor, chain).chain,
      },
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faSquareCheck} />,
        type: 'command',
        label: 'Binary target',
        command: (chain, editor) =>
          insertMetric(MetricExtensionTypes.TODO, editor, chain).chain,
      },
      {
        icon: () => <FontAwesomeIcon fixedWidth icon={faInputNumeric} />,
        type: 'command',
        label: 'Numeric target',
        command: (chain, editor) =>
          insertMetric(MetricExtensionTypes.NUMBER, editor, chain).chain,
      },
    ],
  },
];
