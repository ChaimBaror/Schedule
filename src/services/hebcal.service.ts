import { HebrewCalendar, HDate, Location, Zmanim, GeoLocation, DailyLearning } from '@hebcal/core';
import '@hebcal/learning';
import type { KehilaLocation } from '@/types/kehila';

export const DEFAULT_LOCATION: KehilaLocation = {
  lat: 32.0833,
  lng: 34.8333,
  tzid: 'Asia/Jerusalem',
  cityName: 'Tel Aviv',
};

export const CITIES: Record<string, KehilaLocation> = {
  'tel-aviv': { lat: 32.0833, lng: 34.8333, tzid: 'Asia/Jerusalem', cityName: 'תל אביב' },
  'bnei-brak': { lat: 32.0842, lng: 34.8338, tzid: 'Asia/Jerusalem', cityName: 'בני ברק' },
  'jerusalem': { lat: 31.7683, lng: 35.2137, tzid: 'Asia/Jerusalem', cityName: 'ירושלים' },
  'haifa': { lat: 32.7940, lng: 34.9896, tzid: 'Asia/Jerusalem', cityName: 'חיפה' },
  'beer-sheva': { lat: 31.2518, lng: 34.7913, tzid: 'Asia/Jerusalem', cityName: 'באר שבע' },
  'netanya': { lat: 32.3215, lng: 34.8532, tzid: 'Asia/Jerusalem', cityName: 'נתניה' },
  'ashdod': { lat: 31.8044, lng: 34.6553, tzid: 'Asia/Jerusalem', cityName: 'אשדוד' },
  'modiin': { lat: 31.8969, lng: 35.0095, tzid: 'Asia/Jerusalem', cityName: "מודיעין" },
};

function buildZmanim(location: KehilaLocation, date: Date) {
  const geo = new GeoLocation(null, location.lat, location.lng, 0, location.tzid);
  return new Zmanim(geo, date, false);
}

function buildCandleLighting(location: KehilaLocation, date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  const friday = new Date(date);
  friday.setDate(date.getDate() + daysUntilFriday);
  const geo = new GeoLocation(null, location.lat, location.lng, 0, location.tzid);
  const zmanimFriday = new Zmanim(geo, friday, false);
  return zmanimFriday.sunsetOffset(-20, true);
}

export function getZmanimForLocation(location: KehilaLocation = DEFAULT_LOCATION) {
  return buildZmanim(location, new Date());
}

export function getCandleLightingForLocation(location: KehilaLocation = DEFAULT_LOCATION): Date {
  return buildCandleLighting(location, new Date());
}

export function getDailyLearningDafYomi(): string {
  const hebrewDate = new HDate(new Date());
  const dafYomiEvent = DailyLearning.lookup('dafYomi', hebrewDate);
  return dafYomiEvent.render('he');
}

export function getEventsForLocation(location: KehilaLocation = DEFAULT_LOCATION) {
  const today = new Date();
  const hebrewDate = new HDate(today);
  const calendarOptions = {
    year: hebrewDate.getFullYear(),
    latitude: location.lat,
    longitude: location.lng,
    isHebrewYear: true,
    candlelighting: true,
    shabbatMevarchim: true,
    noSpecialShabbat: true,
    dailyLearning: { dafYomi: hebrewDate },
    location: Location.lookup('Tel Aviv'),
    addHebrewDates: true,
    sedrot: true,
    omer: true,
  };
  return HebrewCalendar.calendar(calendarOptions);
}

export function getTodayHebrewLabel(): string {
  const hebrewDate = new HDate(new Date());
  return hebrewDate.renderGematriya();
}

export function getParashaLabel(): string {
  const events = getEventsForLocation();
  const today = new Date();
  const sedra = events.find(
    (ev) =>
      ev.getDate().greg().toLocaleDateString() === today.toLocaleDateString() &&
      ev.getDesc().includes('Parashat')
  );
  return sedra ? sedra.render('he') : '';
}

// Legacy exports for backward compatibility with existing components
export const getZmanim = () => getZmanimForLocation(DEFAULT_LOCATION);
export const getCandleLightingTime = () => getCandleLightingForLocation(DEFAULT_LOCATION);
export const getEvents = () => getEventsForLocation(DEFAULT_LOCATION);
