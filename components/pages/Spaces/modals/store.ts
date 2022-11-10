import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../stores/RootStore';
import { ModalsController } from '../../../../helpers/ModalsController';
import { SpaceCreationModal } from './SpaceCreationModal';
import { SpaceData } from '../types';

export enum SpacesModalsTypes {
  CREATE_SPACE,
}

export class SpacesModals {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  controller = new ModalsController({
    [SpacesModalsTypes.CREATE_SPACE]: SpaceCreationModal,
  });

  openSpaceCreationModal = (onSave: (space: SpaceData) => void) => {
    this.controller.open({
      type: SpacesModalsTypes.CREATE_SPACE,
      props: {
        callbacks: {
          onSave,
          onClose: this.controller.close,
        },
      },
    });
  };

  openSpaceSettingsModal = (
    space: SpaceData,
    onSave: (space: SpaceData) => void,
    onDelete: (space: SpaceData) => void
  ) => {
    this.controller.open({
      type: SpacesModalsTypes.CREATE_SPACE,
      props: {
        space,
        callbacks: {
          onSave,
          onDelete: () => {
            this.controller.close();
            onDelete(space);
          },
          onClose: this.controller.close,
        },
      },
    });
  };
}
