const { HebrewCalendar, Location } = require('@hebcal/core');
const { eventsToClassicApi } = require('@hebcal/rest-api');

const date = new Date();

const options = {
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  sedrot: true,
  location: Location.lookup('israel'),
  noRoshChodesh: true,
  noMinorFast: true,
  shabbatMevarchim: true
};

const getHolidays = () => {
  const events = HebrewCalendar.calendar(options);
  const apiResult = eventsToClassicApi(events, options);

  return apiResult.items
    .filter(({ yomtov }) => yomtov)
    .map(({ date, title, yomtov, category }) => ({ date, title, yomtov, category }));
};
const isDayOff = (date = new Date().toISOString().slice(0, 10)) =>
  !!getHolidays().find(({ date: holidayDate }) => holidayDate === date);

module.exports = { isDayOff };
