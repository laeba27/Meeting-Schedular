"use client"
import React, { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import LocationOption from "../../../_utils/LocationOption";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from '../../../../Config/FirbaseConfig'
import { toast } from 'sonner'
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from 'next/navigation'

function MeetingForm({setFormValue , meetingDate, selectedTime }) {
const [location, setLocation] = useState();
const [eventName, setEventName] = useState();
const [duration, setDuration] = useState("Choose");
const [locationType, setLocationType] = useState();
const [meetingURL, setmeetingURL] = useState();

const {user}=useKindeBrowserClient();
const db=getFirestore(app);
const router=useRouter();
useEffect(() => {
  
    setFormValue({
      eventName:eventName,
      duration:duration,
      locationType:locationType,
      meetingURL:meetingURL,
      meetingDate:meetingDate , // Include meeting date
      selectedTime:selectedTime,
    })
  
}, [eventName,duration,locationType,meetingURL, meetingDate, selectedTime ])

const onCreateClick=async()=>{
  const id=Date.now().toString();
  await setDoc(doc(db,'MeetingEvent',id),{
      id:id,
      eventName:eventName,
      duration:duration,
      locationType:locationType,
      meetingURL:meetingURL,
      meetingDate:meetingDate , // Include meeting date
      selectedTime:selectedTime,
      // businessId:'Business/'+user?.email
      businessId:doc(db,'Business',user?.email),
      createdBy:user?.email
    })
    toast('New Meeting Event Created!');
    router.replace('/dashboard/meetingtype')
}
  return (
    <div className="p-8">
    <Link href={'/dashboard'}>  <h2 className="flex gap-2">
        <ChevronLeft /> Cancel
      </h2></Link>
    
      <div className="mt-4">
        <h2 className="font-bold text-2xl y-4">Create New Event</h2>
        <hr></hr>
      </div>
      <div className="flex flex-col gap-3 my-4">
        <h2 className="font-bold">Event name *</h2>
        <Input className="capitalize" placeholder="Name of your meeting event  "
        onChange={(event)=>setEventName(event.target.value)} />

        <h2 className="font-bold">Duration*</h2>
        <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="max-w-40">
              {duration} min
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={()=>setDuration(15)}>15 min</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setDuration(30)}>30 min</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setDuration(45)}>45 min</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setDuration(60)}>60 min</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <div>
          
        </div>

        <h2 className="font-bold">Location*</h2>
        <div className="grid grid-cols-4 gap-3">
          {LocationOption.map((option, index) => (
            <div
              key={index}
              className={`border flex flex-col
                     justify-center items-center 
                     p-3 rounded-lg cursor-pointer
                     hover:bg-blue-100 hover:border-primary
                     ${location==option.name&& 'bg-blue-100 border-primary' } ` }
              onClick={() => setLocationType(option.name)}
            >
              <Image
                src={option.icon}
                width={30}
                height={30}
                alt={option.name}
              />
              <h2>{option.name}</h2>
              <hr></hr>
            </div>
          ))}
        </div>
        {locationType&&<><h2 className="font-bold">Add {locationType} Url*  </h2>
        <Input placeholder='Add url'
        onChange={(event)=>setmeetingURL(event.target.value)} /></>}
        {/* <h2 className="font-bold">Select the theme color</h2>
        <div className="flex justify-evenly">
          {ThemeOption.map((color,index)=>{
            <div key={color} className="h-5 w-5 rounded-full"
            style={{backgroundColor:color}}>

            </div>

          })}
        </div> */}
        
      </div>
      <div>
        <Button className="w-full mt-9"
        disabled={(!eventName||!duration||!locationType||!meetingURL||!meetingDate||!selectedTime )}
        onClick={()=>onCreateClick()}
        > Create</Button>
      </div>
    </div>
  );
}

export default MeetingForm;
