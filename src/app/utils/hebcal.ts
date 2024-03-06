import { HebrewCalendar, HDate, Location, Zmanim, GeoLocation, DailyLearning } from '@hebcal/core';
import '@hebcal/learning';

// Initialize Hebrew date based on current date
const currentDate = new Date();
const hebrewDate = new HDate(currentDate);

// Calendar options
const calendarOptions = {
  year: hebrewDate.getFullYear(),
  month: hebrewDate.getMonth(),
  latitude: 32.0833,
  longitude: 34.8333,
  isHebrewYear: true,
  candlelighting: true,
  shabbatMevarchim: true,
  dailyLearning: {
    'dafYomi': hebrewDate
  },
  location: Location.lookup('Tel Aviv'),
  addHebrewDates: true,
  sedrot: true,
  omer: true,
};

// Generate events using HebrewCalendar
const events = HebrewCalendar.calendar(calendarOptions);

// Calculate zmanim
const latitude = 32.0833;
const longitude = 34.8333;
const tzid = 'Asia/Jerusalem';
const friday = new Date();
const geoLocation = new GeoLocation(null, latitude, longitude, 0, tzid);
const zmanim = new Zmanim(geoLocation, friday, false);
const candleLighting = zmanim.sunsetOffset(-20, true);

// Functions to export
export const getEvents = () => events;

export const getZmanim = () => zmanim;

export const getCandleLightingTime = () => candleLighting;

export const getDailyLearningDafYomi = () => {
  const dafYomiEvent = DailyLearning.lookup('dafYomi', hebrewDate);
  return dafYomiEvent.render('he');
};

export const formatTime = (dateString: string | Date, minutesToAdd: number = 0) => {
  const date = new Date(dateString);
  // Add minutes
  date.setMinutes(date.getMinutes() + minutesToAdd);

  // Format the time as "HH:MM"
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
};
