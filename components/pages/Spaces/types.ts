export enum OriginTypes {
  JIRA = 'JIRA',
  TRELLO = 'TRELLO',
  GITHUB = 'GITHUB',
  MAIL = 'MAIL',
}

export type OriginChildData = {
  id: string;
  name: string;
  children?: OriginChildData[];
};

export type OriginData = {
  id: string;
  name: string;
  type: OriginTypes;
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

export type SpacesInboxItemData = {
  id: string;
  title: string;
  descriptionId: string;
  spaceId: string;
  date: number;
  fields?: { key: string; value: string }[];
  origin: {
    type: OriginTypes;
    name: string;
    id: string;
  };
};
