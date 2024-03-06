import { HebrewCalendar, HDate, Location, Event, Zmanim, GeoLocation, DailyLearning } from '@hebcal/core';
import '@hebcal/learning';

const dt = new Date();
const hd = new HDate(dt);


const options = {
  year: hd.getFullYear(),
  month: hd.getMonth(),
  latitude: 32.0833,
  longitude: 34.8333,
  isHebrewYear: true,
  candlelighting: true,
  shabbatMevarchim: true,
  dailyLearning: {
    'dafYomi': hd
  },
  location: Location.lookup('Tel Aviv'),
  sedrot: true,
  omer: true,
};
const events = HebrewCalendar.calendar(options);



const latitude = 32.0833;
const longitude = 34.8333;
const tzid = 'Asia/Jerusalem';
const friday = new Date();
const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
const zmanim = new Zmanim(gloc, friday, false);

const candleLighting = zmanim.sunsetOffset(-20, true);
const timeStr = Zmanim.formatISOWithTimeZone(tzid, candleLighting);

export const getEvents = () => {
  return events;
}

export const getZmanim = () => {
  return zmanim;
}

export const candleLight = () => {
  return candleLighting;
}

export const getDailyLearningDafYomi = () => {
  const ev = DailyLearning.lookup('dafYomi', hd);
  return ev.render('he');

}

export const ft = (dateString: string | Date, minutesToAdd: number = 0) => {
  const date = new Date(dateString);

  // Add minutes
  date.setMinutes(date.getMinutes() + minutesToAdd);

  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  // Format the time as "HH:MM:SS"
  const timeFormat = `${hour}:${minute}`;
  return timeFormat;
}
