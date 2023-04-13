import moment from "moment";

const DATE_FORMAT = 'DD.MM.yyyy';

function getFormattedDate(date?: string) {
  if (!date) {
    return '';
  }

  return moment(date).format(DATE_FORMAT);
}

export const DateHelper = {
  getFormattedDate
};
