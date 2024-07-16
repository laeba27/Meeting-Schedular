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
  SelectLabel,
  SelectValue,
} from "../../../../../components/ui/select";

function EditMeeting({ id }) {
  const db = getFirestore(app);
  const [docData, setDocData] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    duration: "",
  });
  const [locationType, setLocationType] = useState();
  const [meetingURL, setMeetingURL] = useState();
  const [durationTime, setDurationTime] = useState("");
  const getData = async () => {
    const docRef = doc(db, "MeetingEvent", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();
      setDocData(data);
      setFormData({
        eventName: data.eventName || "",
        duration: data.duration || "",
        locationType: data.locationType || "",
        meetingURL: data.meetingURL || ""
      });
    } else {
      console.log("No such document!");
    }
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "MeetingEvent", id);
      await updateDoc(docRef, formData);
      console.log("Document successfully updated!");
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

  const handleUrlChange = (event) =>{
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      meetingURL: value,
    }));
    setMeetingURL(value);
  }

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      duration: value,
    }));
    setDurationTime(value);
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
      console.log(id, "edit data");
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
                <div className="flex flex-col gap-1 ">
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
                <div className="flex flex-col gap-1 ">
                  <Label className="py-2" htmlFor="duration">
                    Duration
                  </Label>
                  <Select
                    value={docData?.duration}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue  placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                    
                      <SelectItem value="15 min">15 min</SelectItem>
                      <SelectItem value="30 min">30 min</SelectItem>
                      <SelectItem value="45 min">45 min</SelectItem>
                      <SelectItem value="60 min">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1 ">
                  <Label className="py-2" htmlFor="duration">
                    Location
                  </Label>
                  <Select
                    value={docData?.locationType}
                    onValueChange={handleSelectLocation}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue  placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zoom">Zoom </SelectItem>
                      <SelectItem value="Meet">Meet</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1 ">
                {locationType && (
          <div className="flex flex-col gap-1 ">
            <h2 className="font-medium">Change {locationType} URL*</h2>
            <Input
              placeholder="Change URL"
              value={docData?.meetingURL}
              onChange={handleUrlChange}
            />
          </div>
        )}
                </div>

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
