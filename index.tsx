import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
לחץ Commit new file.
קובץ שלישי: metadata.json
שם הקובץ: metadata.json
תוכן להעתקה:
code
JSON
{
  "name": "מערכת לקביעת שיעורים פרטיים",
  "description": "אפליקציה המאפשרת למשתמשים לקבוע שיעורים פרטיים במתמטיקה, פיזיקה ואנגלית בשעות קבועות מראש במהלך השבוע."
}
לחץ Commit new file.
קובץ רביעי: types.ts
שם הקובץ: types.ts
תוכן להעתקה:
code
Ts
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
