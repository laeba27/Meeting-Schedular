"use client";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Calendar } from "../../../../components/ui/calendar";
import { Button } from "../../../../components/ui/button";


function PreviewMeeting({  formValue, date, setDate, selectedTime, setSelectedTime}) {
 
  const [timeSlots, setTimeSlots] = useState([]);
  
  

  useEffect(() => {
    formValue?.duration && createTimeSlot(formValue?.duration);
  }, [formValue]);

  const createTimeSlot = (interval) => {
    const startTime = 8 * 60; // 8 AM in minutes
    const endTime = 22 * 60; // 10 PM in minutes
    const totalSlots = (endTime - startTime) / interval;
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
      const period = hours >= 12 ? "PM" : "AM";
      return `${String(formattedHours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${period}`;
    });
    setTimeSlots(slots);
  };



  return (
    <div className="p-5 py-10 shadow-lg m-5 border-t-8">
      <Image src="/logo.svg" alt="logo" width={150} height={150} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
        {/* Meeting info */}
        <div className="p-4 border-r">
          <div>
            <h2>Business Name</h2>
            <h2 className="font-bold text-2xl capitalize">
              {formValue?.eventName ? formValue?.eventName : "Meeting Name"}
            </h2>
          </div>

          <div className="flex flex-col mt-5 gap-4">
            <h2 className="flex gap-2">
              <Clock />
              {formValue?.duration} Min{" "}
            </h2>
            <h2 className="flex gap-2">
              <MapPin />
              {formValue?.locationType} Meeting{" "}
            </h2>
            <h2 className="flex gap-2">
        <CalendarDays />
        {date ? date.toDateString() : "Select a date"}{" "}- 
        {selectedTime && <span>{selectedTime}</span>}
      </h2>

            <Link
              href={formValue?.meetingURL ? formValue?.meetingURL : "#"}
              className="text-primary"
            >
              <h2>{formValue?.meetingURL}</h2>
            </Link>
          </div>
        </div>
        {/* Time and date selection */}
        <div className="md:col-span-2 flex justify-evenly p-4">
          <div className="flex flex-col">
            <h2 className="font-bold">Select Date and Time</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mt-5"
              disabled={(date) => date <= new Date()}
            />
          </div>
          <div
            className="flex flex-col w-full overflow-auto gap-4 p-5"
            style={{ maxHeight: "340px" }}
          >
            {timeSlots?.map((time, index) => (
              <Button
                key={index}
                className={`border-primary text-primary ${
                  selectedTime === time && "bg-primary text-white"
                }`}
                variant="outline"
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default PreviewMeeting;
