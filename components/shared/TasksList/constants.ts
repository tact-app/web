export enum Lists {
  TODAY = 'today',
  WEEK = 'week',
  NEW = 'new'
}

export const referenceToList: Record<string, Lists> = {
  today: Lists.TODAY,
  tomorrow: Lists.WEEK,
  week: Lists.WEEK,
};
