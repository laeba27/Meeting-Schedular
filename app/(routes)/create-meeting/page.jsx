"use client";
import { useState } from 'react';
import React from 'react';
import MeetingForm from './_components/MeetingForm';
import PreviewMeeting from './_components/PreviewMeeting';


function CreateMeeting() {
  const [formValue, setFormValue] = useState({});
  const [date, setDate] = useState(new Date()); // Initialize date
  const [selectedTime, setSelectedTime] = useState(null); // Initialize selected time

  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
      {/* Meeting Form  */}
      <div className='shadow-md border h-screen'>
      <MeetingForm 
          setFormValue={setFormValue} 
          meetingDate={date} 
          selectedTime={selectedTime} 
          // Pass setDate if needed
        />
      </div>
      <div className='md:col-span-2'>
        <PreviewMeeting 
        formValue={formValue} 
          date={date} // Pass date as prop
          setDate={setDate} 
          selectedTime={selectedTime} // Pass selectedTime here
          setSelectedTime={setSelectedTime} 
        />  
      </div>
    </div>
  );
}

export default CreateMeeting;
