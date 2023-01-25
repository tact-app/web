type CombinationPick = {
    altKey?: KeyboardEvent['altKey'];
    ctrlKey?: KeyboardEvent['ctrlKey'];
    metaKey?: KeyboardEvent['metaKey'];
    shiftKey?: KeyboardEvent['shiftKey'];
    code?: KeyboardEvent['code'];
};

const getCombinationPickByKey = (key: string): CombinationPick => {
    const metaKeysMap = {
        alt: 'altKey',
        control: 'ctrlKey',
        meta: 'metaKey',
        shift: 'shiftKey',
    } as const;

    const metaKey = metaKeysMap[key.toLowerCase()];

    if (metaKey) {
        return { [metaKey]: true };
    }

    return {
        code: `Key${key.toUpperCase()}`,
    };
};

export const checkKeyCombination = (
    event: KeyboardEvent,
    combinationString: string
): boolean => {
    if (!combinationString) {
        return false;
    }

    const defaultCombinationPick = {
        metaKey: false,
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
    };

    const combination = combinationString.split('+').map((key) => key.trim());

    const combinationPick = combination.reduce(
        (acc, key) => ({ ...acc, ...getCombinationPickByKey(key) }),
        defaultCombinationPick
    );

    return Object.entries(combinationPick).every(
        ([key, value]) => event[key] === value
    );
};

export const checkKeyCombinations = (
    event: KeyboardEvent,
    combinations: string[]
): boolean => (
    combinations.every((combinationString) => checkKeyCombination(event, combinationString))
);
