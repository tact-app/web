export type OriginChildData = {
  name: string;
  id: string;
  children?: OriginChildData[];
};

export type OriginData = {
  id: string;
  name: string;
  children: OriginChildData[];
};

export type SpaceData = {
  id: string;
  name: string;
  color: string;
  shortName: string;
  children: OriginData[];
};

export enum SpacesFocusableBlocks {
  INBOX = 'INBOX',
  TREE = 'TREE',
  INBOX_ITEM = 'INBOX_ITEM',
}
