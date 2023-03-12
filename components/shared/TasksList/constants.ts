export enum Lists {
  TODAY = 'today',
  WEEK = 'week',
}

export const referenceToList: Record<string, Lists> = {
  today: Lists.TODAY,
  tomorrow: Lists.WEEK,
  week: Lists.WEEK,
};
