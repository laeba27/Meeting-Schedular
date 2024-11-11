"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import LocationOption from "../../../_utils/LocationOption";
import Image from "next/image";
import Link from "next/link";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from '../../../../Config/FirbaseConfig';
import { toast } from 'sonner';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from 'next/navigation';

// Helper function to generate a random string
const generateRandomId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

function MeetingForm({ setFormValue, meetingDate, selectedTime }) {
  const [location, setLocation] = useState();
  const [eventName, setEventName] = useState();
  const [duration, setDuration] = useState("Choose");
  const [locationType, setLocationType] = useState();
  const [meetingURL, setMeetingURL] = useState();

  const { user } = useKindeBrowserClient();
  const db = getFirestore(app);
  const router = useRouter();

  // Function to generate a user-friendly meeting URL
  const generateMeetingURL = () => {
    const uniqueId = generateRandomId(); // Generate a random ID
    const sanitizedEventName = eventName ? eventName.replace(/\s+/g, '-').toLowerCase() : 'meeting';
    const generatedURL = `http://localhost:3000/dashboard/videocall/${sanitizedEventName}-${uniqueId}`; // Use your actual website domain
    setMeetingURL(generatedURL); // Set the URL in state
    return generatedURL;
  };

  useEffect(() => {
    setFormValue({
      eventName: eventName,
      duration: duration,
      locationType: locationType,
      meetingURL: meetingURL,
      meetingDate: meetingDate,
      selectedTime: selectedTime,
    });
  }, [eventName, duration, locationType, meetingURL, meetingDate, selectedTime]);

  // Update the meeting URL automatically when location type is selected
  const handleLocationClick = (locationName) => {
    setLocationType(locationName);
    const generatedURL = generateMeetingURL(); // Generate URL when location type is clicked
    setMeetingURL(generatedURL); // Set the URL to the input field
  };

  // Function to handle meeting creation
  const onCreateClick = async () => {
    const id = Date.now().toString();

    await setDoc(doc(db, 'MeetingEvent', id), {
      id: id,
      eventName: eventName,
      duration: duration,
      locationType: locationType,
      meetingURL: meetingURL,  // Save generated URL
      meetingDate: meetingDate,
      selectedTime: selectedTime,
      businessId: doc(db, 'Business', user?.email),
      createdBy: user?.email,
    });

    toast('New Meeting Event Created!');
    router.replace('/dashboard/meetingtype');
  };

  return (
    <div className="p-8">
      <Link href={'/dashboard'}>
        <h2 className="flex gap-2">
          <ChevronLeft /> Cancel
        </h2>
      </Link>

      <div className="mt-4">
        <h2 className="font-bold text-2xl y-4">Create New Event</h2>
        <hr />
      </div>
      <div className="flex flex-col gap-3 my-4">
        <h2 className="font-bold">Event name *</h2>
        <Input
          className="capitalize"
          placeholder="Name of your meeting event"
          onChange={(event) => setEventName(event.target.value)}
        />

        <h2 className="font-bold">Duration*</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="max-w-40">
              {duration} min
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setDuration(15)}>15 min</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(30)}>30 min</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(45)}>45 min</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(60)}>60 min</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h2 className="font-bold">Location*</h2>
        <div className="grid grid-cols-4 gap-3">
          {LocationOption.map((option, index) => (
            <div
              key={index}
              className={`border flex flex-col justify-center items-center p-3 rounded-lg cursor-pointer hover:bg-blue-100 hover:border-primary ${location === option.name && 'bg-blue-100 border-primary'}`}
              onClick={() => handleLocationClick(option.name)} // Generate URL on location click
            >
              <Image src={option.icon} width={30} height={30} alt={option.name} />
              <h2>{option.name}</h2>
            </div>
          ))}
        </div>

        {locationType && (
          <>
            <h2 className="font-bold">Add {locationType} URL*</h2>
            <Input value={meetingURL} placeholder="Add URL" onChange={(event) => setMeetingURL(event.target.value)} />
          </>
        )}
      </div>
      <div>
        <Button
          className="w-full mt-9"
          disabled={!eventName || !duration || !locationType || !meetingURL || !meetingDate || !selectedTime}
          onClick={onCreateClick}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default MeetingForm;
