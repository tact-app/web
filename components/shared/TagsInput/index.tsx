import { HStack, Input, Tag } from '@chakra-ui/react';
import React, { FC } from 'react';
import { TactTaskTag } from '../TactTaskTag';
import { TaskTag } from '../TasksList/types';

export interface TagsInputProps {
    tags?: TaskTag[];
    removeTag: (tagId: string) => void;
    addTag: (tag: string) => void;
}

export const TagsInput: FC<TagsInputProps> = ({ tags, addTag, removeTag }) => {
    const handleKeyDown = (e) => {
        if (e.code !== 'Enter' && e.code !== 'Space') return
        const value = e.target.value
        if (!value.trim()) {
            e.target.value = ''
            return
        }
        addTag(value)
        e.target.value = ''
    }

    return (
        <HStack
            w='100%'
            flexWrap='wrap'
            align='center'
            gap={2}
            p={2}
            border='2px solid #4299E1'
            borderRadius={2}
            css={{
                '& > button, input': {
                    'margin-inline-start': '0px!important',
                }
            }}
        >
            {tags?.map(({ title, id }) => (
                <TactTaskTag
                    title={title}
                    showRemoveIcon
                    buttonProps={{
                        mr: 0,
                        key: id,
                    }}
                    iconButtonProps={{
                        onClick: (e) => {
                            e.stopPropagation();
                            removeTag(id);
                        }
                    }}
                />
            ))}

            <Input
                placeholder='# Type in a tag'
                flexGrow={1}
                onKeyDown={handleKeyDown}
                variant="unstyled"
                w='unset'
            />
        </HStack>
    )
}
