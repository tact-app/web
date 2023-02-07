import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../stores/RootStore';
import { ModalsController } from '../../../../helpers/ModalsController';
import { SpaceCreationModal } from './SpaceCreationModal';
import { SpaceData } from '../types';
import { SpaceConnectAppsModal } from './SpaceConnectAppsModal';

export enum SpacesModalsTypes {
  CREATE_SPACE,
  CREATE_СONGRATULATIONS,
  SPACE_CONNECTIONS,
}

export class SpacesModals {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  controller = new ModalsController({
    [SpacesModalsTypes.CREATE_SPACE]: SpaceCreationModal,
    [SpacesModalsTypes.CREATE_СONGRATULATIONS]: SpaceConnectAppsModal,
  });

  openSpaceСonnectionsModal = (
    space: SpaceData,
    onConnect: (space: SpaceData) => (app: string) => void
  ) => {
    this.controller.open({
      type: SpacesModalsTypes.CREATE_СONGRATULATIONS,
      props: {
        space,
        callbacks: {
          onConnect: onConnect(space),
          onClose: this.controller.close,
        },
      },
    });
  };

  openSpaceCreationModal = (
    onSave: (space: SpaceData) => void,
    onConnect: (space: SpaceData) => void
    ) => {
    this.controller.open({
      type: SpacesModalsTypes.CREATE_SPACE,
      props: {
        callbacks: {
          onConnect,
          onSave,
          onClose: this.controller.close,
        },
      },
    });
  };

  openSpaceSettingsModal = (
    space: SpaceData,
    onSave: (space: SpaceData) => void,
    onDelete: (spaceId: string) => void,
  ) => {
    this.controller.open({
      type: SpacesModalsTypes.CREATE_SPACE,
      props: {
        space,
        callbacks: {
          onSave,
          onDelete: (spaceId: string) => {
            this.controller.close();
            onDelete(spaceId);
          },
          onClose: this.controller.close,
        },
      },
    });
  };
}
