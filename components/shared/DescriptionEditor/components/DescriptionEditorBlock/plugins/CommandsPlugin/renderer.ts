import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { ReactComponent } from 'react-hotkeys';

const getRenderer = <T extends {
  onKeyDown: (props: any) => boolean,
  handleClose: () => void,
  handleOpen: () => void
}>(component: ReactComponent, store: T) => () => {
  let renderedComponent;
  let popup;

  return {
    onStart: (props) => {
      renderedComponent = new ReactRenderer(component, {
        props: { ...props, instance: store },
        editor: props.editor
      });

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: renderedComponent.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start'
      });

      store.handleOpen();
    },
    onUpdate(props) {
      renderedComponent.updateProps({ ...props, instance: store });

      popup[0].setProps({
        getReferenceClientRect: props.clientRect
      });
    },
    onKeyDown(props) {
      if (props.event.key === 'Escape') {
        popup[0].hide();

        return true;
      }

      return store.onKeyDown(props);
    },
    onExit() {
      store.handleClose();
      popup[0].destroy();
      renderedComponent.destroy();
    }
  };
};

export default getRenderer;
