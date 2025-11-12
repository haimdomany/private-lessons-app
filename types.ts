export enum Subject {
  Math = 'מתמטיקה',
  Physics = 'פיזיקה',
  English = 'אנגלית',
}

export interface TimeSlot {
  day: string;
  time: string;
}

export interface BookedSlot extends TimeSlot {
  subject: Subject;
}
