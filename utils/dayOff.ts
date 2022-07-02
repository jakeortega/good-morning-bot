import { HebrewCalendar, Location } from '@hebcal/core';
import { eventsToClassicApi } from '@hebcal/rest-api';
import cron from 'node-schedule';
import fs from 'fs';

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

interface Holiday {
  date: string;
  title: string;
  yomtov: boolean;
  category: string;
}

const getHolidays = (): Holiday[] => {
  const events = HebrewCalendar.calendar(options);
  const apiResult = eventsToClassicApi(events, options);

  return (apiResult.items as Holiday[])
    .filter(({ yomtov }) => yomtov)
    .map(({ date, title, yomtov, category }) => ({ date, title, yomtov, category }));
};
const isDayOff = (date = new Date().toISOString().slice(0, 10)): boolean => {
  const holidays = fs.readFileSync('./holidays.json', 'utf8');
  const HolidayList: Holiday[] = JSON.parse(holidays);
  return !!HolidayList.find(({ date: holidayDate }) => holidayDate === date);
};

cron.scheduleJob('0 0 1 * *', () => {
  const holidayJson = JSON.stringify(getHolidays(), null, 2);
  fs.writeFileSync('./holiday.json', holidayJson);
});

export { isDayOff };
