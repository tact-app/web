type CombinationPick = {
    altKey?: KeyboardEvent['altKey'];
    ctrlKey?: KeyboardEvent['ctrlKey'];
    metaKey?: KeyboardEvent['metaKey'];
    shiftKey?: KeyboardEvent['shiftKey'];
    code?: KeyboardEvent['code'];
    key?: KeyboardEvent['key'];
};

const getCombinationPickByKey = (key: string): CombinationPick => {
    const metaKeysMap = {
        Alt: 'altKey',
        Control: 'ctrlKey',
        Meta: 'metaKey',
        Shift: 'shiftKey',
    } as const;

    const keyCodesMap = {
        Space: true,
        Escape: true,
        Tab: true,
        ArrowUp: true,
        ArrowDown: true,
        ArrowLeft: true,
        ArrowRight: true,
        CapsLock: true,
        Backspace: true,
        Enter: true,
    } as const;

    const metaKey = metaKeysMap[key];

    if (metaKey) {
        return {
            [metaKey]: true,
            key
        };
    }

    if (keyCodesMap[key]) {
        return {
            code: key,
        };
    }

    if (/^[a-zA-Z]$/.test(key)) {
        return {
            code: `Key${key.toUpperCase()}`,
        };
    }

    return {
        key
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
        (acc, key) => ({
            ...acc,
            key: null,
            ...getCombinationPickByKey(key)
        }),
        defaultCombinationPick
    );

    return Object.entries(combinationPick).every(
        ([key, value]) => value === null || event[key] === value
    );
};

export const checkKeyCombinations = (
    event: KeyboardEvent,
    combinations: string[]
): boolean => (
    combinations.every((combinationString) => checkKeyCombination(event, combinationString))
);
