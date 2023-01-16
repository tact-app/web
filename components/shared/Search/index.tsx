import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { SearchIcon } from '../../shared/Icons/SearchIcon';
import React, { ChangeEvent } from 'react';

type Props = {
    onChange(value: string): void;
    placeholder?: string;
};

export function Search({ onChange, placeholder = 'Search...' }: Props) {
    const onSearchHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <InputGroup size='md' mb={6}>
            <Input placeholder={placeholder} borderWidth='2px' onInput={onSearchHandleChange} />
            <InputRightElement>
                <SearchIcon />
            </InputRightElement>
        </InputGroup>
    );
}
