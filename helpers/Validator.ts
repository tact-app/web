import { makeAutoObservable } from "mobx";

export enum ErrorTypes {
  REQUIRED = 'required',
}
export type ErrorMessagesMap = Record<ErrorTypes, string>;

export type FieldsErrorsToCheck = Record<string, ErrorTypes[]>;
export type FieldsErrorsToCheckOrCallback = FieldsErrorsToCheck | (() => FieldsErrorsToCheck);

export type FieldsValues = Record<string, string>;
export type FieldsValuesOrCallback = Record<string, string> | (() => FieldsValues);

const DEFAULT_ERROR_MAP: ErrorMessagesMap = {
  [ErrorTypes.REQUIRED]: 'The field is required',
};
const VALIDATE_FUNCTIONS_MAP: Record<ErrorTypes, (value: string) => boolean> = {
  [ErrorTypes.REQUIRED]: (value) => !value
};

export class Validator {
  private fullErrorMessagesMap: ErrorMessagesMap = DEFAULT_ERROR_MAP;
  private isSubmitted: boolean = false;

  constructor({
    fieldsErrorsToCheck,
    fieldsValues,
    errorsMessagesMap
  }: {
    fieldsErrorsToCheck?: FieldsErrorsToCheckOrCallback;
    errorsMessagesMap?: ErrorMessagesMap;
    fieldsValues?: FieldsValuesOrCallback;
  } = {}) {
    this.fullErrorMessagesMap = { ...DEFAULT_ERROR_MAP, ...(errorsMessagesMap ?? {}) };
    this._fieldsErrorsToCheck = fieldsErrorsToCheck ?? {};
    this._fieldsValues = fieldsValues ?? {};

    makeAutoObservable(this);
  }

  private _fieldsErrorsToCheck: FieldsErrorsToCheckOrCallback = {};

  get fieldsErrorsToCheck() {
    return typeof this._fieldsErrorsToCheck === 'function'
      ? this._fieldsErrorsToCheck()
      : this._fieldsErrorsToCheck;
  }

  private _fieldsValues: FieldsValuesOrCallback = {};

  get fieldsValues() {
    return typeof this._fieldsValues === 'function'
      ? this._fieldsValues()
      : this._fieldsValues;
  }

  get errorsByFields() {
    if (!this.isSubmitted) {
      return {};
    }

    return Object.entries(this.fieldsErrorsToCheck).reduce((acc, [field, errorsToCheck]) => {
      if (!acc[field]) {
        acc[field] = {};
      }

      errorsToCheck.forEach((errorToCheck) => {
        if (VALIDATE_FUNCTIONS_MAP[errorToCheck](this.fieldsValues[field])) {
          acc[field][errorToCheck] = this.fullErrorMessagesMap[errorToCheck];
        }
      })

      return acc;
    }, {} as Record<string, Partial<ErrorMessagesMap>>);
  }

  get areAllFieldsValid() {
    return Object.keys(this.fieldsValues).every(
      (field) => !Object.values(this.errorsByFields[field]).length
    );
  }

  getFieldFirstError = (field: string) => {
    return Object.values(this.errorsByFields[field] ?? {})[0];
  }

  updateIsSubmitted = (isSubmitted: boolean) => {
    this.isSubmitted = isSubmitted;
  }
}
