import { RootStore } from './index';
import React, { FC } from 'react';
import { makeAutoObservable } from 'mobx';

export class MenuStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  replacerComponent: React.FC | null = null;
  props: any = {};

  get replacer() {
    const Component = this.replacerComponent;

    if (Component) {
      return <Component {...this.props} />;
    }

    return null;
  }

  setReplacer = <C extends FC, Props extends any>(
    replacerComponent: C,
    props: C extends FC<infer Props> ? Props : never
  ) => {
    this.replacerComponent = replacerComponent;
    this.props = props;
  };

  resetReplacer = () => {
    this.replacerComponent = null;
    this.props = {};
  };
}
