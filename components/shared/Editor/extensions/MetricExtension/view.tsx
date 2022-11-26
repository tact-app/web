import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import {
  CircularProgress,
  HStack,
  Input,
  chakra,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import {
  MetricExtensionProps,
  MetricExtensionStoreProvider,
  useMetricExtensionStore,
} from './store';
import { MetricExtensionTypes } from './command';
import { AutoFitInput } from '../../../AutoFitInput';
import {
  useRunAfterUpdate,
  wrapChange,
} from '../../../../../helpers/inputChangeWrapper';

const COMPLETED_EMOJI = '🎉';

export const MetricExtensionComponent = observer(
  function MetricExtensionComponent(props: MetricExtensionProps) {
    return (
      <MetricExtensionStoreProvider {...props}>
        <MetricExtensionView {...props} />
      </MetricExtensionStoreProvider>
    );
  }
);

const MetricExtensionRingValue = observer(function MetricExtensionRingValue() {
  const store = useMetricExtensionStore();
  const runAfterUpdate = useRunAfterUpdate();

  return (
    <chakra.div position='relative' contentEditable={false}>
      <Text
        contentEditable={false}
        onClick={store.handleFocus}
        position='absolute'
        variant='unstyled'
        left={0}
        right={0}
        top={0}
        bottom={0}
        m='auto'
        textAlign='center'
        fontWeight='bold'
        overflow='hidden'
        fontSize='sm'
        w={8}
        display='flex'
        alignItems='center'
        justifyContent='center'
        transition='opacity 0s'
        opacity={store.isFocused ? 0 : 1}
      >
        {store.isCompleted ? COMPLETED_EMOJI : store.value}
      </Text>
      <CircularProgress
        value={store.value}
        contentEditable={false}
        size={8}
        transition='opacity 0.2s'
        opacity={store.isFocused ? 0 : 1}
      />
      <Input
        h={8}
        value={store.value + '%'}
        onKeyDown={store.handleKewDown}
        onChange={wrapChange(store.handleChangeValue, runAfterUpdate, 1)}
        onFocus={store.handleFocus}
        onBlur={store.handleBlur}
        ref={store.setInputRef}
        position='absolute'
        variant='unstyled'
        right={0}
        top={0}
        bottom={0}
        m='auto'
        textAlign='center'
        fontWeight='bold'
        fontSize='sm'
        overflow='hidden'
        w={10}
        transition='opacity 0s'
        opacity={store.isFocused ? 1 : 0}
      />
    </chakra.div>
  );
});

const MetricExtensionTodoValue = observer(function MetricExtensionTodoValue() {
  const store = useMetricExtensionStore();

  return (
    <Checkbox
      ref={store.setInputRef}
      onKeyDown={store.handleKewDown}
      contentEditable={false}
      pr={1}
      size='lg'
      isChecked={store.isCompleted}
      onChange={store.handleChangeToDo}
    />
  );
});

const MetricExtensionNumberValue = observer(
  function MetricExtensionNumberValue() {
    const store = useMetricExtensionStore();
    const runAfterUpdate = useRunAfterUpdate();

    return (
      <chakra.div
        position='relative'
        contentEditable={false}
        fontWeight='bold'
        fontSize='sm'
        display='flex'
      >
        <AutoFitInput
          h={8}
          inputRef={store.setInputRef}
          value={store.value}
          onKeyDown={store.handleKewDown}
          onChange={wrapChange(store.handleChangeStartValue, runAfterUpdate)}
          onFocus={store.handleFocus}
          onBlur={store.handleBlur}
          variant='unstyled'
          textAlign='center'
        />
        {store.isCompleted && !store.isFocused ? (
          <Text
            contentEditable={false}
            onClick={store.handleFocus}
            variant='unstyled'
            textAlign='center'
            display='flex'
            alignItems='center'
            justifyContent='center'
            mr={1}
            ml={1}
          >
            {COMPLETED_EMOJI}
          </Text>
        ) : (
          <>
            <Text
              contentEditable={false}
              onClick={store.handleFocus}
              variant='unstyled'
              textAlign='center'
              display='flex'
              alignItems='center'
              justifyContent='center'
              mr={1}
              ml={1}
            >
              →
            </Text>
            <AutoFitInput
              h={8}
              value={store.targetValue}
              inputRef={store.setSecondInputRef}
              onKeyDown={store.handleSecondKewDown}
              onChange={wrapChange(
                store.handleChangeTargetValue,
                runAfterUpdate
              )}
              onFocus={store.handleFocus}
              onBlur={store.handleBlur}
              variant='unstyled'
              textAlign='center'
            />
          </>
        )}
      </chakra.div>
    );
  }
);

const MetricExtensionValueSwitcher = observer(
  function MetricExtensionValueSwitcher() {
    const store = useMetricExtensionStore();

    switch (store.type) {
      case MetricExtensionTypes.RING:
        return <MetricExtensionRingValue />;
      case MetricExtensionTypes.TODO:
        return <MetricExtensionTodoValue />;
      case MetricExtensionTypes.NUMBER:
        return <MetricExtensionNumberValue />;
      default:
        return null;
    }
  }
);

export const MetricExtensionView = observer(function MetricExtensionView() {
  return (
    <NodeViewWrapper className='react-component'>
      <HStack justifyContent='space-between' minH={8}>
        <NodeViewContent
          style={{
            minWidth: '2px',
          }}
        />
        <MetricExtensionValueSwitcher />
      </HStack>
    </NodeViewWrapper>
  );
});
