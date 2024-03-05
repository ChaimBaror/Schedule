import { HebrewCalendar, HDate, Location, Event, Zmanim, GeoLocation } from '@hebcal/core';
const d = new HDate();

const options = {
  year: d.getFullYear(),
  month: d.getMonth() ,
  latitude: 32.0833,
  longitude: 34.8333,
  isHebrewYear: true,
  candlelighting: true,
  shabbatMevarchim: true,
  dailyLearning: {
    dafYomi: true,
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

export const ft = (dateString: string | Date) => {
  const date = new Date(dateString);

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Format the time as "HH:MM:SS"
  const timeFormat = hour + ":" + minute + ":" + second;
  return timeFormat;
}