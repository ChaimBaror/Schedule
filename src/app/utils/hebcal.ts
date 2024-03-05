import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';


const options = {
  year: 2024,
  month: 3,
  isHebrewYear: false,
  candlelighting: true,
  addHebrewDates: true,
  dailyLearning: {
    dafYomi: '1',
  },
  location: Location.lookup('Jerusalem'),
  sedrot: true,
  omer: true,
};
const events = HebrewCalendar.calendar(options);



export const getEvents = () =>{
    return events;
}