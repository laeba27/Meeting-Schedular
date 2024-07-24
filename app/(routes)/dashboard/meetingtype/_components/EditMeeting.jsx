"use client"
import React, { useEffect, useState } from "react";
import { app } from "../../../../../Config/FirbaseConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { Pen } from "lucide-react";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { doc, getFirestore, getDoc, updateDoc } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { toast } from "sonner";

function EditMeeting({ id, onUpdate }) {
  const db = getFirestore(app);
  const [formData, setFormData] = useState({
    eventName: "",
    duration: "",
    locationType: "",
    meetingURL: "",
    meetingDate:"", // Include meeting date
    selectedTime:""
  });
  const [locationType, setLocationType] = useState("");

  const getData = async () => {
    const docRef = doc(db, "MeetingEvent", id);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      setFormData({
        eventName: data.eventName || "",
        duration: data.duration || "",
        locationType: data.locationType || "",
        meetingURL: data.meetingURL || "",
        meetingDate: data.meetingDate || "" , // Include meeting date
      selectedTime: data.selectedTime || "",
      });
      setLocationType(data.locationType || "");
      // Ensure you maintain all the data fields here
    } else {
      console.log("No such document!");
    }
  };
  

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "MeetingEvent", id);
      await updateDoc(docRef, formData);
      console.log("Document successfully updated!");
      toast("Event has been Updated");
      
      // Notify parent component with updated data
      if (onUpdate) {
        onUpdate({ id, ...formData });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUrlChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      meetingURL: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      duration: value,
    }));
  };

  const handleSelectLocation = (value) => {
    setLocationType(value);
    setFormData((prevData) => ({
      ...prevData,
      locationType: value,
    }));
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex items-center justify-start gap-4 px-2 hover:font-semibold">
          <Pen className="h-4 w-4" />
          Edit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="py-2 capitalize" htmlFor="eventName">
                    Event Name
                  </Label>
                  <Input
                    className="capitalize"
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="py-2" htmlFor="duration">
                    Duration
                  </Label>
                  <Select
                    value={formData.duration}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 min">15 min</SelectItem>
                      <SelectItem value="30 min">30 min</SelectItem>
                      <SelectItem value="45 min">45 min</SelectItem>
                      <SelectItem value="60 min">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="py-2" htmlFor="locationType">
                    Location
                  </Label>
                  <Select
                    value={formData.locationType}
                    onValueChange={handleSelectLocation}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zoom">Zoom</SelectItem>
                      <SelectItem value="Meet">Meet</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {locationType && (
                  <div className="flex flex-col gap-1">
                    <h2 className="font-medium">Change {locationType} URL*</h2>
                    <Input
                      placeholder="Change URL"
                      value={formData.meetingURL}
                      onChange={handleUrlChange}
                    />
                  </div>
                )}
                <Button onClick={handleUpdate}>Update</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditMeeting;
