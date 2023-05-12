import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { ListNavigation } from "../../../../../helpers/ListNavigation";
import { WONT_DO_OTHER_REASON, WONT_DO_REASONS } from "./constants";
import { ChangeEvent } from "react";
import { NavigationDirections } from "../../../../../types/navigation";
import { ErrorTypes, Validator } from "../../../../../helpers/Validator";
import { GlobalHooks } from '../../../../../helpers/GlobalHooksHelper';

export type GoalWontDoSubmitModalProps = {
  onClose(): void;
  onSubmit(reason: string): void;
};

export class GoalWontDoSubmitModalStore {
  isSubmitted: boolean = false;
  reason: string = '';
  otherReason: string = '';
  textareaRef: HTMLTextAreaElement = null;

  navigation = new ListNavigation(undefined, true);
  validator = new Validator({
    fieldsErrorsToCheck: () => ({
      reason: [ErrorTypes.REQUIRED],
      otherReason: this.reason === WONT_DO_OTHER_REASON ? [ErrorTypes.REQUIRED] : [],
    }),
    fieldsValues: () => ({
      reason: this.reason,
      otherReason: this.otherReason,
    })
  });

  callbacks: Pick<GoalWontDoSubmitModalProps, 'onClose' | 'onSubmit'>;
  keymap = {
    SAVE: ['ctrl+enter']
  };

  globalHooks = {
    [GlobalHooks.MetaEnter]: () => {
      this.textareaRef?.blur();
      this.handleSubmit();
    }
  };

  constructor() {
    makeAutoObservable(this);
  }

  get reasons() {
    return WONT_DO_REASONS.map((item) => ({ value: item, label: item }));
  }

  handleSubmit = () => {
    this.isSubmitted = true;

    this.validator.updateIsSubmitted(true);

    if (this.validator.areAllFieldsValid) {
      this.callbacks?.onSubmit(this.otherReason || this.reason);
    }
  };

  hotkeysHandlers = {
    SAVE: this.handleSubmit
  };

  handleChangeReason = (reason: string) => {
    this.reason = reason;

    if (reason !== WONT_DO_OTHER_REASON) {
      this.otherReason = '';
    }
  };

  handleOtherReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    this.otherReason = e.target.value;
  };

  setTextareaRef = (ref: HTMLTextAreaElement) => {
    this.navigation.setRefs(WONT_DO_REASONS.length, ref);
    this.textareaRef = ref;
  };

  handleTextareaNavigate = (direction: NavigationDirections) => {
    switch (direction) {
      case NavigationDirections.UP:
        this.navigation.refs[WONT_DO_REASONS.length - 1].focus();
        break;
      case NavigationDirections.DOWN:
        this.navigation.refs[0].focus();
        break;
      default:
        break;
    }
  }

  update = ({ onSubmit, onClose }: GoalWontDoSubmitModalProps) => {
    this.callbacks = {
      onClose,
      onSubmit,
    };
  };
}

export const {
  StoreProvider: GoalWontDoSubmitModalStoreProvider,
  useStore: useGoalWontDoSubmitModalStore
} = getProvider(GoalWontDoSubmitModalStore);
