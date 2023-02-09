const itemsKey = 'inbox-items-stub';
const descriptionKey = 'inbox-descriptions-stub';

export const getStubItems = (path: string[] = []) => {
  const localStorageItems = JSON.parse(localStorage.getItem(itemsKey)) || [];
  const strPath = path.join('/');

  const bundles = localStorageItems.filter(([key]) => key.startsWith(strPath));

  return bundles
    .reduce((acc, [, items]) => [...acc, ...items], [])
    .sort((a, b) => b.date - a.date);
};

export const getStubDescription = (ids: string) => {
  const localStorageItems =
    JSON.parse(localStorage.getItem(descriptionKey)) || {};

  return localStorageItems[ids];
};
