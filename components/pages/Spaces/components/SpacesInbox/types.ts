export enum SpacesInboxItemStatusTypes {
  NEW = 'new',
  HANDLED = 'handled',
  COMPLETED = 'completed',
}

export type SpacesInboxItemData = {
  id: string;
  title: string;
  status: SpacesInboxItemStatusTypes;
  descriptionId: string;
  icon: string;
};
