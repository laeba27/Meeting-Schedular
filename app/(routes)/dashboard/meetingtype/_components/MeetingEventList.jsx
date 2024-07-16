"use client";
import { app } from "../../../../../Config/FirbaseConfig";
import { Button } from "../../../../../components/ui/button";
import { format } from "date-fns";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  CalendarCheck,
  Clock,
  Copy,
  Hourglass,
  MapPin,
  Pen,
  Settings,
  Trash,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import EditMeeting from "./EditMeeting";

function MeetingEventList() {
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [eventList, setEventList] = useState([]);
  const [isOpen, setisOpen] = useState(false)
  useEffect(() => {
    if (user) {
      getEventList();
    }

    console.log(eventList,"this is my data");
    
  }, [user]);
  const getEventList = async () => {
    setEventList([]);
    const q = query(
      collection(db, "MeetingEvent"),
      where("createdBy", "==", user?.email),
      orderBy("id", "desc")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setEventList((prevEvent) => [...prevEvent, doc.data()]);
    });
  };
  const onDeleteMeetingEvent = async (event) => {
    await deleteDoc(doc(db, "MeetingEvent", event?.id)).then((resp) => {
      toast("Meeting Event Deleted!");
      getEventList();
    });
  };
  return (
    <div
      className="mt-10 grid grid-cols-1 md:grid-cols-2 
    lg:grid-cols-3 gap-7"
    >
      {eventList.length > 0 ? (
        eventList?.map((event, index) => (
          <div
            className="border flex flex-col gap-5  shadow-md border-t-8 border-t-primary rounded-lg p-5"
            key={index}
          >
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Settings className="cursor-pointer " />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  <div className=" hover:bg-gray-100 hover:font-semibold rounded-sm p-1 gap-3">
                    {" "}
                    <EditMeeting id={event.id}  />
                  </div>

                  <DropdownMenuItem
                    onClick={() => onDeleteMeetingEvent(event)}
                    className="flex gap-4 hover:font-bold"
                  >
                    {" "}
                    <Trash className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h2 className="font-md  text-xl capitalize">{event?.eventName}</h2>
            <div className="flex justify-between">
              <h2 className="flex gap-2 text-sm  text-gray-800">
                <Clock /> {event?.duration} Minutes
              </h2>
              <h2 className="flex gap-2 text-sm  text-gray-500">
                <MapPin /> {event.locationType} Meeting{" "}
              </h2>
            </div>
            <div className="flex justify-between">
              {event?.selectedTime && (
                <h2 className="flex gap-2 text-sm  text-gray-800">
                  <Hourglass /> {event?.selectedTime}{" "}
                </h2>
              )}

              {event?.meetingDate && (
                <h2 className="flex gap-2 text-sm text-gray-800">
                  <CalendarCheck />{" "}
                  {format(event.meetingDate.toDate(), "MMMM d, yyyy ")}
                </h2>
              )}
            </div>

            <hr></hr>
            <div className="flex justify-between items-center">
              <h2
                onClick={() => {
                  navigator.clipboard.writeText(event?.meetingURL);
                  toast("Copy to clickboard");
                }}
                className="flex cursor-pointer gap-2 text-sm items-center text-primary"
              >
                <Copy className="h-4 w-4" /> Copy Link{" "}
              </h2>
              <Button className="text-white cursor-pointer rounded-full border border-white">
                Share
              </Button>
            </div>
          </div> // end of div.p-5.border-r
        ))
      ) : (
        <h2>Loading</h2>
      )}
    </div>
  );
}

export default MeetingEventList;
