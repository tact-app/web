import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../../stores/RootStore';
import { getProvider } from '../../../../../../helpers/StoreProvider';
import { GoalDataExtended, GoalStatus } from '../../../types';
import { GoalListStore } from '../store';
import {
  faBoxArchive,
  faCircleCheck,
  faCircleMinus,
  faClone,
  faSquareArrowUpRight,
  faTrashCan
} from '@fortawesome/pro-light-svg-icons';
import { DatePickerHelpers } from '../../../../../shared/DatePicker/helpers';
import ReactDatePicker from 'react-datepicker';
import { NavigationDirections } from '../../../../../../types/navigation';
import { getBoxShadowAsBorder } from '../../../../../../helpers/baseHelpers';
import { GOAL_STATE_PARAMS } from '../../../../../shared/GoalStateIcon';
import { KeyboardEvent, MouseEvent } from 'react';

export type GoalItemProps = {
  goal: GoalDataExtended
};

export class GoalItemStore {
  goal: GoalDataExtended = undefined;

  ref: HTMLDivElement;
  startDateRef: ReactDatePicker;
  targetDateRef: ReactDatePicker;
  emojiSelectRef: HTMLButtonElement;

  directionsForResetTitle = [
    NavigationDirections.DOWN,
    NavigationDirections.LEFT,
    NavigationDirections.RIGHT,
    NavigationDirections.TAB,
    NavigationDirections.BACK
  ];

  constructor(
    public root: RootStore,
    public parent: GoalListStore,
  ) {
    makeAutoObservable(this);
  }

  get actions() {
    return [
      {
        icon: faSquareArrowUpRight,
        title: 'Open',
        command: '↵/⌥O',
        onClick: () => this.parent.callbacks?.onOpenGoal(this.goal.id),
      },
      {
        icon: faCircleCheck,
        title: this.isDone ? 'Unmark as done' : 'Done',
        command: '⌥D',
        onClick: () => this.parent.doneGoal(this.goal),
      },
      {
        icon: faCircleMinus,
        title: this.isWontDo ? "Unmark as won't do" : "Won't do",
        command: '⌥W',
        onClick: () => this.parent.callbacks?.onWontDo(this.goal),
      },
      {
        icon: faClone,
        title: 'Clone',
        command: '⌥C',
        hidden: !this.parent.hasClone,
        onClick: () => this.parent.cloneGoal(this.goal),
      },
      {
        icon: faBoxArchive,
        title: this.goal?.isArchived ? 'Unarchive' : 'Archive',
        command: '⌥A',
        onClick: () => this.parent.archiveGoal(this.goal),
      },
      {
        icon: faTrashCan,
        title: 'Delete',
        command: '⌫ / ⌘⌫',
        onClick: () => this.parent.handleDeleteGoal(this.goal?.id),
      },
    ];
  }

  get isDone() {
    return this.goal?.status === GoalStatus.DONE;
  }

  get isWontDo() {
    return this.goal?.status === GoalStatus.WONT_DO;
  }

  get isFocused() {
    return this.goal?.id === this.parent.focusedGoalId;
  }

  get boxShadow() {
    if (this.isFocused) {
      return getBoxShadowAsBorder('blue.400', 2);
    }

    return getBoxShadowAsBorder(
      this.goal?.customFields.state
        ? GOAL_STATE_PARAMS[this.goal.customFields.state].color
        : 'gray.200',
      1
    );
  }

  handleClick = () => {
    if (this.isFocused) {
      this.handleOpenGoal();
    }
  };

  handleOpenGoal = () => {
    this.parent.callbacks?.onOpenGoal(this.goal?.id)
  };

  setEmojiSelectRef = (element: HTMLButtonElement) => {
    this.emojiSelectRef = element;
  };

  setStartDateRef = (element: ReactDatePicker) => {
    this.startDateRef = element;
  };

  setTargetDateRef = (element: ReactDatePicker) => {
    this.targetDateRef = element;
  };

  handleChangeStartDate = (date: string) => {
    return this.parent.callbacks?.onUpdateGoal({
      ...this.goal,
      startDate: date,
      targetDate: DatePickerHelpers.isStartDateAfterEndDate(date, this.goal?.targetDate)
        ? ''
        : this.goal?.targetDate
    });
  };

  handleChangeTargetDate = (date: string) => {
    return this.parent.callbacks?.onUpdateGoal({ ...this.goal, targetDate: date });
  };

  handleChangeTitle = (title: string) => {
    return this.parent.callbacks?.onUpdateGoal({ ...this.goal, title });
  };

  handleChangeIcon = (icon: string) => {
    return this.parent.callbacks?.onUpdateGoal({
      ...this.goal,
      icon: { ...this.goal?.icon, value: icon }
    });
  };

  handleColorChange = (color: string) => {
    return this.parent.callbacks?.onUpdateGoal({
      ...this.goal,
      icon: { ...this.goal?.icon, color }
    });
  };

  setGoalAsFocused = () => {
    this.parent.setFocusedGoalId(this.goal?.id);
  };

  updateEditedGoal = () => {
    this.parent.setEditedGoalId(this.goal?.id);
  };

  handleEmojiPickerToggle = (isOpen: boolean) => {
    if (isOpen) {
      this.updateEditedGoal();
    } else {
      this.setGoalAsFocused();
    }
  };

  handleDatePickerFocus = (isFocused: boolean) => {
    if (isFocused) {
      this.updateEditedGoal();
    }
  };

  handleFocus = () => {
    if (!this.parent.isFocusedGoalEditing && !this.parent.isMenuOpenedForFocusedGoal) {
      this.setGoalAsFocused();
    }
  };

  handleIconNavigate = (direction: NavigationDirections, event: KeyboardEvent) => {
    switch (direction) {
      case NavigationDirections.INVARIANT:
        return this.setGoalAsFocused();
      case NavigationDirections.RIGHT:
      case NavigationDirections.TAB:
        event.preventDefault();
        return this.parent.getGoalTitleElement(this.goal.id).click();
      case NavigationDirections.DOWN:
        return this.startDateRef?.setFocus();
      case NavigationDirections.BACK:
        event.preventDefault();
        return this.targetDateRef?.setFocus();
      default:
        return;
    }
  };

  handleTitleNavigate = (direction: NavigationDirections, event: KeyboardEvent) => {
    switch (direction) {
      case NavigationDirections.INVARIANT:
        return this.setGoalAsFocused();
      case NavigationDirections.BACK:
      case NavigationDirections.LEFT:
        event.preventDefault();
        return this.emojiSelectRef?.focus();
      case NavigationDirections.DOWN:
      case NavigationDirections.RIGHT:
      case NavigationDirections.TAB:
        event.preventDefault();
        return this.startDateRef?.setFocus();
      default:
        return;
    }
  };

  handleStartDateNavigate = (direction: NavigationDirections, event: KeyboardEvent) => {
    switch (direction) {
      case NavigationDirections.INVARIANT:
        this.setGoalAsFocused();
        break;
      case NavigationDirections.BACK:
      case NavigationDirections.LEFT:
        event.preventDefault();
        this.startDateRef?.setOpen(false);
        this.parent.getGoalTitleElement(this.goal.id).click();
        break;
      case NavigationDirections.RIGHT:
      case NavigationDirections.TAB:
        event.preventDefault();
        this.startDateRef?.setOpen(false);
        this.targetDateRef?.setFocus();
        break;
      default:
        break;
    }
  };

  handleTargetDateNavigate = (direction: NavigationDirections, event: KeyboardEvent) => {
    switch (direction) {
      case NavigationDirections.INVARIANT:
        return this.setGoalAsFocused();
      case NavigationDirections.BACK:
      case NavigationDirections.LEFT:
        event.preventDefault();
        this.targetDateRef?.setOpen(false);
        return this.startDateRef?.setFocus();
      case NavigationDirections.TAB:
        event.preventDefault();
        return this.emojiSelectRef?.focus();
      default:
        return;
    }
  };

  handleMenuToggle = (isOpen: boolean) => {
    this.parent.toggleActionMenuForGoal(this.goal.id, isOpen);
  };

  handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    this.parent.toggleActionMenuForGoal(this.goal.id, this.isFocused ? !this.parent.isMenuOpenedForFocusedGoal : true, e.pageX);
  };

  update = ({ goal }: GoalItemProps) => {
    this.goal = goal;
  };
}

export const {
  StoreProvider: GoalItemStoreProvider,
  useStore: useGoalItemStore
} = getProvider(GoalItemStore);
