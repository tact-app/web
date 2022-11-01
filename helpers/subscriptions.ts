export const subscriptions = (...reactions: Array<() => void>) => {
  return () => {
    reactions.forEach((reaction) => reaction());
  };
};
