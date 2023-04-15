import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalDataExtended } from "../../types";
import { GoalListProps, GoalListCallbacks } from './types';
import { EDITABLE_TITLE_ID_SLUG } from "../../../../shared/EditableTitle";
import { SpaceData } from "../../../Spaces/types";

export class GoalListStore {
  listBySpaces: Record<string, GoalDataExtended[]> = {};
  callbacks: GoalListCallbacks;

  goalsRefs: Record<string, HTMLDivElement> = {};

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  get hasClone() {
    return Boolean(this.callbacks?.onCloneGoal);
  }

  setGoalRef = (goalId: string, ref: HTMLDivElement) => {
    this.goalsRefs[goalId] = ref;
  }

  getGoalTitleElement = (goalId: string) => {
    return this.goalsRefs[goalId].querySelector(
      `#${EDITABLE_TITLE_ID_SLUG}-${goalId}`
    ) as HTMLParagraphElement;
  };

  cloneGoal = async (goal: GoalDataExtended) => {
    if (!this.hasClone) {
      return;
    }

    const clonedGoal = await this.callbacks.onCloneGoal(goal);
    this.getGoalTitleElement(clonedGoal.id).click();
  }

  getSpace = (spaceId: string) => {
    return toJS(this.root.resources.spaces.getById(spaceId));
  }

  updateSpace = (space: SpaceData) => {
    return this.root.resources.spaces.update(space);
  }

  update = ({ listBySpaces, onUpdateGoal, onDeleteGoal, onCloneGoal, onOpenGoal, onWontDo }: GoalListProps) => {
    this.listBySpaces = listBySpaces;
    this.callbacks = {
      onCloneGoal,
      onDeleteGoal,
      onUpdateGoal,
      onOpenGoal,
      onWontDo,
    };
  };
}

export const {
  StoreProvider: GoalListStoreProvider,
  useStore: useGoalListStore
} = getProvider(GoalListStore);
