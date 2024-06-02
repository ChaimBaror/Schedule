import { HebrewCalendar, HDate, Location, Zmanim, GeoLocation, DailyLearning } from '@hebcal/core';
import '@hebcal/learning';

// Initialize Hebrew date based on current date
const currentDate = new Date();
const hebrewDate = new HDate(currentDate);

// Calendar options
const calendarOptions = {
  year: hebrewDate.getFullYear(),
  latitude: 32.0833,
  longitude: 34.8333,
  isHebrewYear: true,
  candlelighting: true,
  shabbatMevarchim: true,
  noSpecialShabbat: true,
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
const today = new Date();
const geoLocation = new GeoLocation(null, latitude, longitude, 0, tzid);
const zmanim = new Zmanim(geoLocation, today, false);

const getNextFriday = () => {
  const dayOfWeek = today.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7; // 5 is the index of Friday
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  return nextFriday;
};
const fridayDate = getNextFriday();
const zmanimFriday =  new Zmanim(geoLocation, fridayDate, false);
const candleLighting = zmanimFriday.sunsetOffset(-20, true);


// Functions to export
export const getEvents = () => events;

export const getZmanim = () => zmanim;

export const getCandleLightingTime = () => candleLighting;

export const getDailyLearningDafYomi = () => {
  
  const dafYomiEvent = DailyLearning.lookup('dafYomi', hebrewDate);
  return dafYomiEvent.render('he');
};


