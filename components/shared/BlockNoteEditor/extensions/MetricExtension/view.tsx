import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { CircularProgress, HStack, Input, chakra } from '@chakra-ui/react';

export const MetricExtensionView = (props) => {
  const handleChange = (e) => {
    props.updateAttributes({
      value: Math.min(Math.max(0, parseInt(e.target.value)), 100),
    });
  };

  return (
    <NodeViewWrapper className='react-component'>
      <HStack justifyContent='space-between'>
        <NodeViewContent className='content'/>
        <chakra.div position='relative' contentEditable={false}>
          <CircularProgress value={props.node.attrs.value} contentEditable={false}/>
          <Input
            type='number'
            value={props.node.attrs.value}
            onChange={handleChange}
            position='absolute'
            variant='unstyled'
            left={0}
            right={0}
            top={0}
            bottom={0}
            m='auto'
            textAlign={'center'}
            fontWeight={'bold'}
            w={8}
          />
        </chakra.div>
      </HStack>
    </NodeViewWrapper>
  );
};
