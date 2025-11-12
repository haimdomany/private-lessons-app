import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Subject, TimeSlot, BookedSlot } from './types';
import { INITIAL_AVAILABLE_SLOTS } from './constants';
import SubjectSelector from './components/SubjectSelector';
import ScheduleGrid from './components/ScheduleGrid';
import BookingModal from './components/BookingModal';
import DeleteModal from './components/DeleteModal';
import Header from './components/Header';
import AdminScheduleEditor from './components/AdminScheduleEditor';

type AvailableSlots = { [key: string]: string[] };

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [modalSlot, setModalSlot] = useState<TimeSlot | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<BookedSlot | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>(() => {
    try {
      const savedSlots = localStorage.getItem('availableSlots');
      return savedSlots ? JSON.parse(savedSlots) : INITIAL_AVAILABLE_SLOTS;
    } catch (error) {
      console.error("Failed to parse available slots from localStorage", error);
      return INITIAL_AVAILABLE_SLOTS;
    }
  });

  const handleSelectSubject = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
  }, []);

  const handleSelectSlot = useCallback((slot: TimeSlot) => {
    if (selectedSubject) {
      setModalSlot(slot);
    } else {
      alert('יש לבחור מקצוע תחילה');
    }
  }, [selectedSubject]);

  const handleCloseModal = useCallback(() => {
    setModalSlot(null);
  }, []);

  const handleConfirmBooking = useCallback(() => {
    if (modalSlot && selectedSubject) {
      setBookedSlots(prevSlots => [...prevSlots, { ...modalSlot, subject: selectedSubject }]);
      setModalSlot(null);
      setSuccessMessage('השיעור נקבע בהצלחה!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [modalSlot, selectedSubject]);

  const handleDeleteSlot = useCallback((slot: BookedSlot) => {
    setSlotToDelete(slot);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setSlotToDelete(null);
  }, []);

  const handleConfirmDeletion = useCallback(() => {
    if (slotToDelete) {
      setBookedSlots(prevSlots => prevSlots.filter(
        s => !(s.day === slotToDelete.day && s.time === slotToDelete.time)
      ));
      setSlotToDelete(null);
      setSuccessMessage('השיעור בוטל בהצלחה!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [slotToDelete]);
  
  const handleToggleSlotAvailability = useCallback((day: string, time: string) => {
    setAvailableSlots(currentSlots => {
      const newSlots = JSON.parse(JSON.stringify(currentSlots)); // Deep copy
      const daySlots = newSlots[day] ? [...newSlots[day]] : [];
      const timeIndex = daySlots.indexOf(time);
  
      if (timeIndex > -1) {
        daySlots.splice(timeIndex, 1);
      } else {
        daySlots.push(time);
        daySlots.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      }
  
      if (daySlots.length > 0) {
        newSlots[day] = daySlots;
      } else {
        delete newSlots[day];
      }
      
      return newSlots;
    });
  }, []);

  const handleSaveChanges = useCallback(() => {
    localStorage.setItem('availableSlots', JSON.stringify(availableSlots));
    setSuccessMessage('מערכת השעות עודכנה בהצלחה!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [availableSlots]);

  const subjectColors = useMemo(() => ({
    [Subject.Math]: 'blue',
    [Subject.Physics]: 'purple',
    [Subject.English]: 'green',
  }), []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8 relative">
       <button
        onClick={() => setIsAdminMode(!isAdminMode)}
        className="absolute top-4 left-4 bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors px-4 py-2 rounded-lg z-20"
        aria-label={isAdminMode ? 'עבור לתצוגת תלמיד' : 'עבור למצב ניהול'}
      >
        {isAdminMode ? 'תצוגת תלמיד' : 'מצב ניהול'}
      </button>

      <div className="max-w-7xl mx-auto">
        <Header />
        
        {isAdminMode ? (
          <AdminScheduleEditor 
            availableSlots={availableSlots}
            onToggleAvailability={handleToggleSlotAvailability}
            onSave={handleSaveChanges}
          />
        ) : (
          <main>
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-cyan-400">1. בחירת מקצוע</h2>
              <SubjectSelector
                selectedSubject={selectedSubject}
                onSelectSubject={handleSelectSubject}
                colors={subjectColors}
              />
            </div>

            <div className="bg-slate-800 rounded-lg shadow-xl p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-cyan-400">2. בחירת מועד לשיעור</h2>
              <p className={`mb-2 text-slate-400 transition-opacity duration-300 ${!selectedSubject ? 'opacity-100' : 'opacity-0 h-0'}`}>
                נא לבחור מקצוע כדי להציג את המועדים הפנויים.
              </p>
              <p className="mb-4 text-slate-400">
                  לחצו על משבצת 'פנוי' כדי לקבוע שיעור, או על משבצת 'תפוס' כדי לבטל אותו.
              </p>
              <ScheduleGrid
                availableSlots={availableSlots}
                bookedSlots={bookedSlots}
                onSelectSlot={handleSelectSlot}
                onDeleteSlot={handleDeleteSlot}
                selectedSubject={selectedSubject}
                colors={subjectColors}
              />
            </div>
          </main>
        )}
        
        {modalSlot && selectedSubject && (
          <BookingModal
            slot={modalSlot}
            subject={selectedSubject}
            onClose={handleCloseModal}
            onConfirm={handleConfirmBooking}
            color={subjectColors[selectedSubject]}
          />
        )}

        {slotToDelete && (
          <DeleteModal
            slot={slotToDelete}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDeletion}
            color={subjectColors[slotToDelete.subject]}
          />
        )}

        {showSuccess && (
          <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 text-white py-2 px-6 rounded-lg shadow-lg z-50 ${successMessage.includes('בוטל') ? 'bg-yellow-600' : successMessage.includes('נקבע') ? 'bg-green-500' : 'bg-sky-500'}`}>
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
