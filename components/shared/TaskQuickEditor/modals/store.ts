import { ModalsController } from '../../../../helpers/ModalsController';
import { GoalCreationModal } from '../../../pages/Goals/modals/GoalCreationModal';
import { SpaceCreationModal } from '../../../pages/Spaces/modals/SpaceCreationModal';
import { SpaceData } from '../../../pages/Spaces/types';
import { RootStore } from '../../../../stores/RootStore';


export enum ModalsTypes {
  ADD_GOAL,
  ADD_SPACE,
}

export class TasksEditorModals {
  constructor(public root: RootStore) { }

  controller = new ModalsController({
    [ModalsTypes.ADD_GOAL]: GoalCreationModal,
    [ModalsTypes.ADD_SPACE]: SpaceCreationModal,
  });

  openGoalCreationModal = (cb?: () => void) => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.ADD_GOAL,
      props: {
        onSave: async (data) => {
          await this.root.resources.goals.add(data);
          this.controller.close();
          this.root.toggleModal(false);
          cb && cb();
        },
        onClose: () => {
          this.controller.close();
          this.root.toggleModal(false);
          cb && cb();
        },
      },
    });
  };

  openSpaceCreationModal = (cb?: () => void) => {
    this.root.toggleModal(true);
    this.controller.open({
      type: ModalsTypes.ADD_SPACE,
      props: {
        callbacks: {
          onSave: (space: SpaceData) => {
            this.root.api.spaces.add(space);
            this.controller.close();
            this.root.toggleModal(false);
            cb && cb();
          },
          onClose: () => {
            this.controller.close();
            this.root.toggleModal(false);
            cb && cb();
          },
        },
      },
    });
  };
}
