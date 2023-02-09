import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { OriginTypes, SpacesInboxItemData } from '../../types';

const itemsKey = 'inbox-items-stub';
const descriptionKey = 'inbox-descriptions-stub';

const addItemsToLocalStorage = (path, items) => {
    const localStorageItems = JSON.parse(localStorage.getItem(itemsKey)) || [];

    localStorageItems.push([path.join('/'), items]);

    localStorage.setItem(itemsKey, JSON.stringify(localStorageItems));
};

const addDescriptionToLocalStorage = (id: string, description: string) => {
    const localStorageItems =
        JSON.parse(localStorage.getItem(descriptionKey)) || {};

    localStorageItems[id] = description;

    localStorage.setItem(descriptionKey, JSON.stringify(localStorageItems));
};

const generateRandomItems = (path: string[], origin) => {
    const items: SpacesInboxItemData[] = Array.from({
        length: faker.datatype.number({ min: 3, max: 10 }),
    }).map(() => {
        const title = faker.company.catchPhrase();
        const id = uuidv4();
        const descriptionId = uuidv4();
        const description = faker.lorem.paragraph(faker.datatype.number(6));
        const fields = faker.datatype.boolean()
            ? Array.from({
                length: faker.datatype.number({ min: 1, max: 10 }),
            }).map(() => ({
                key: faker.company.bsNoun(),
                value: faker.helpers.arrayElement([
                    faker.company.bsNoun(),
                    '',
                    faker.date.past().toDateString(),
                    faker.name.fullName(),
                    faker.datatype.number(50000).toString(),
                ]),
            }))
            : undefined;

        addDescriptionToLocalStorage(descriptionId, description);

        return {
            id,
            spaceId: path[0],
            date: faker.date
                .between('2020-01-01T00:00:00.000Z', new Date().toISOString())
                .valueOf(),
            title,
            fields,
            descriptionId,
            origin,
        };
    });

    addItemsToLocalStorage(path, items);
};


const getRandomLevels = (levels = 0, origin, path = []) => {
    return levels > 0
        ? Array.from({
            length: faker.datatype.number({ min: 1, max: 4 }),
        }).map(() => {
            const firstLevelName = faker.company.bsNoun();
            const levelName =
                firstLevelName.slice(0, 1).toUpperCase() + firstLevelName.slice(1);
            const levelId = uuidv4();
            const levelPath = [...path, levelId];

            generateRandomItems(levelPath, origin);

            return {
                id: levelId,
                name: levelName,
                children: getRandomLevels(levels - 1, origin, levelPath),
            };
        })
        : [];
};

export const getNewConnect = (spaceId: string, appName: string) => {
    const originType = appName.toUpperCase() as OriginTypes;
    const originId = uuidv4();

    return {
        id: originId,
        name: appName,
        type: originType,
        children: getRandomLevels(
            4,
            {
                id: originId,
                name: appName,
                type: originType,
            },
            [spaceId, originId]
        ),
    };
};

export const STUBS_APPS = [
    {
        iconType: OriginTypes.GITHUB,
        name: 'GitHub',
        description: 'View the latest updates from GitHub',
        isNew: false,
    },
    {
        iconType: OriginTypes.NOTION,
        name: 'Notion',
        description: 'Capture thoughts, manage projects, or even run an entire company',
        isNew: true,
        isConnected: true,
    },
    {
        iconType: OriginTypes.TRELLO,
        name: 'Trello',
        description: 'Easily sync Trello cards',
        isNew: false,
    },
    {
        iconType: OriginTypes.JIRA,
        name: 'Jira',
        description: 'View the latest updates from Jira in Tact',
        isNew: false,
    },
    {
        iconType: OriginTypes.GITLAB,
        name: 'GitLab',
        description: 'View the latest updates from GitLab',
        isNew: false,
    },
]
