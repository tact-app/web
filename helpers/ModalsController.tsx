import React, { FC } from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

export type ModalDescriptor<Type, Props> = {
  type: Type
  props: Props
}

// Map to Union type transformation
// {[key]: FC<Props>} => {type: key1, props: Props1} | {type: key2, props: Props2}
type UnionizeFCMap<Map extends Record<keyof Map, FC<any>>> = {
  [Key in keyof Map]: ModalDescriptor<Key, Map[Key] extends FC<infer Props> ? Props : never>
}[keyof Map]

export class ModalsController<ModalsMapType extends Record<keyof ModalsMapType, FC<any>>> {
  constructor(public modals: ModalsMapType) {
    makeAutoObservable(this);
  }

  currentModalDescriptor: UnionizeFCMap<ModalsMapType> | null = null;

  get component() {
    if (this.currentModalDescriptor) {
      return this.modals[this.currentModalDescriptor.type];
    }

    return null;
  }

  get props() {
    return this.currentModalDescriptor.props;
  }

  get isOpen() {
    return !!this.currentModalDescriptor;
  }

  open = (modalDescriptor: ModalsController<ModalsMapType>['currentModalDescriptor']) => {
    console.log(this.modals, modalDescriptor);
    this.currentModalDescriptor = modalDescriptor;
  };

  close = () => {
    this.currentModalDescriptor = null;
  };
}

export const ModalsSwitcher = observer(function ModalsSwitcher<T extends Record<any, any>>({ controller }: { controller: ModalsController<T> }) {
  const Component = controller.component;

  if (Component) {
    return <Component {...controller.props as Object} />;
  } else {
    return null;
  }
});