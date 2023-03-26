import moment from "moment";

function isStartDateAfterEndDate(startDate: string, endDate: string) {
  return moment(startDate).isAfter(moment(endDate));
}

export const DatePickerHelpers = {
  isStartDateAfterEndDate
};
