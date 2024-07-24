"use client"; // This directive tells Next.js to treat this file as a client-side component.

import { app } from "../../../Config/FirbaseConfig"; // Import Firebase configuration.
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"; // Import Kinde authentication client.
import React, { useEffect, useState } from "react"; // Import React and hooks.
import { doc, getDoc, getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore"; // Import Firestore functions.
import { useRouter } from "next/navigation"; // Import Next.js router for navigation.
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar component.
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the dayGrid plugin for FullCalendar.
import Image from "next/image"; // Import Image component for optimized images.
import Head from 'next/head';
function Dashboard() {
  const [myEvents, setEvents] = useState([]); // State to hold the list of events.
  const db = getFirestore(app); // Initialize Firestore with the Firebase app.
  const { user } = useKindeBrowserClient(); // Get user information from Kinde authentication.
  const [loading, setLoading] = useState(true); // State to handle loading state.
  const router = useRouter(); // Get Next.js router instance.

  useEffect(() => {
    if (user?.email) {
      isBusinessRegistered(); // Check if the user's business is registered.
      getEventList(); // Fetch the list of events for the user.
    }
  }, [user]); // Run the effect when the user changes.

  // Function to check if the user's business is registered.
  const isBusinessRegistered = async () => {
    const docRef = doc(db, "Business", user.email); // Reference to the business document.
    const docSnap = await getDoc(docRef); // Get the document snapshot.

    if (docSnap.exists()) {
      setLoading(false); // Set loading to false if the document exists.
    } else {
      setLoading(false); // Set loading to false if the document does not exist.
      router.replace('/create-business'); // Redirect to create-business page.
    }
  };

  // Function to fetch the list of events created by the user.
  const getEventList = async () => {
    if (!user?.email) return; // Return if there is no user email.

    const q = query(
      collection(db, "MeetingEvent"), // Reference to the MeetingEvent collection.
      where("createdBy", "==", user.email), // Filter events created by the user.
      orderBy("id", "desc") // Order events by ID in descending order.
    );

    const querySnapshot = await getDocs(q); // Get the documents.
    const events = []; // Array to hold event data.
    querySnapshot.forEach((doc) => {
      const eventData = doc.data(); // Get data from the document.
      if (eventData.meetingDate) {
        const eventDate = eventData.meetingDate.toDate(); // Convert Firestore timestamp to JavaScript Date.
        const eventDateString = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0]; // Format the date as a string (YYYY-MM-DD).
        events.push({
          title: eventData.eventName,
          date: eventDateString,
          extendedProps: {
            time: eventData.selectedTime, // Add the meeting time to extendedProps.
            isPast: new Date(eventDate) < new Date() // Determine if the event is in the past.
          }
        });
      }
    });
    setEvents(events); // Update the state with the events.
  };

  // Render loading spinner while data is being fetched.
  if (loading) {
    return (
      <div className="h-screen w-[150vh] flex items-center justify-center">
        <Image src="/spinner.svg" alt="spinner" height={300} width={300} />
      </div>
    );
  }

  // Function to render the content of each event.
  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <h2 className="capitalize">{eventInfo.event.title}</h2> {/* Display the event title. */}
        <div>{eventInfo.event.extendedProps.time}</div> {/* Display the event time. */}
      </div>
    );
  };

  // Function to determine the class names for event styling based on whether it is past or not.
  const getEventClassNames = (event) => {
    if (event.extendedProps && event.extendedProps.isPast) {
      return 'bg-red-500 text-white'; // Apply red background and white text for past events.
    }
   
    return ''; // No additional classes for non-past events.
    
  };

  
  return (
    <div className="p-10">
     <Head>
     <meta name="google-site-verification" content="TdMZcCgup5n4hjeG2MIGCa8DzJj41atsbr3-gy55xIc" />
      </Head>
      <FullCalendar
        plugins={[dayGridPlugin]} // Use the dayGridPlugin for calendar view.
        initialView="dayGridMonth" // Set the initial view to a month grid.
        events={myEvents} // Provide the list of events to FullCalendar.
        eventContent={renderEventContent} // Use custom render function for event content.
        eventClassNames={(event) => getEventClassNames(event.event)} // Apply custom classes to events.
     
      />

    </div>
  );
}

export default Dashboard;
