import { Subject } from './types';

export const SUBJECTS: Subject[] = [Subject.Math, Subject.Physics, Subject.English];

export const DAYS_OF_WEEK: string[] = [
  'יום ראשון',
  'יום שני',
  'יום שלישי',
  'יום רביעי',
  'יום חמישי',
];

export const TIME_SLOTS: string[] = [
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
];

export const INITIAL_AVAILABLE_SLOTS: { [key: string]: string[] } = {
  'יום ראשון': ['16:00', '17:00'],
  'יום שני': ['17:00', '18:00', '19:00'],
  'יום שלישי': ['16:00', '20:00'],
  'יום רביעי': ['17:00', '18:00'],
  'יום חמישי': ['16:00', '19:00', '20:00'],
};
