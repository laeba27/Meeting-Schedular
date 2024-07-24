"use client";
import { app } from "../../../Config/FirbaseConfig";
import {  useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Image from "next/image";


function Dashboard() {
  const [myEvents, setEvents] = useState([]);
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient(); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      isBusinessRegistered();
      getEventList();
    }
  }, [user]);

  const isBusinessRegistered = async () => {
    const docRef = doc(db, "Business", user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLoading(false);
    } else {
      setLoading(false);
      router.replace('/create-business');
    }
  };

  const getEventList = async () => {
    if (!user?.email) return;

    const q = query(
      collection(db, "MeetingEvent"),
      where("createdBy", "==", user.email),
      orderBy("id", "desc")
    );

    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      if (eventData.meetingDate) {
        const eventDate = eventData.meetingDate.toDate();
        const eventDateString = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
        events.push({
          title: eventData.eventName,
          date: eventDateString,
          extendedProps: {
            time: eventData.selectedTime
          }
        });
      }
    });
    setEvents(events);
  };

  if (loading) {
    return <div className=" h-screen w-[150vh] flex items-center justify-center">
    <Image src="/spinner.svg" alt="spinner" height={300} width={300} />
  </div> ;
  }

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <h2 className="capitalize">{eventInfo.event.title}</h2>
        <div>{eventInfo.event.extendedProps.time}</div>
      </div>
    );
  };

  return (
    <div className="p-10">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={myEvents}
        eventContent={renderEventContent} // Custom render function for events
      />
    </div>
  );
}

export default Dashboard;
