export enum SpacesInboxItemStatusTypes {
  NEW = 'new',
  HANDLED = 'handled',
  COMPLETED = 'completed',
}

export type SpacesInboxItemData = {
  id: string;
  title: string;
  descriptionId: string;
  icon: string;
  spaceId: string;
  origin: {
    type: string;
    name: string;
    id: string;
  };
};
