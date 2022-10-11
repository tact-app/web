export enum BlockTypes {
  PARAGRAPH = 'paragraph',
  HEADING = 'heading',
  NUMBERED_LIST = 'numbered-list',
  BULLET_LIST = 'bullet-list',
}

export type Block<T, C> = {
  id: string;
  type: T;
  content: C;
}

export type Blocks =
  | Block<BlockTypes.PARAGRAPH, string>
  | Block<BlockTypes.HEADING, string>
  | Block<BlockTypes.NUMBERED_LIST, string[]>
  | Block<BlockTypes.BULLET_LIST, string[]>