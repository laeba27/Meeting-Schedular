"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../../components/ui/sheet";
import { Input } from "../../../../../components/ui/input";
import Image from "next/image";
import { Button } from "../../../../../components/ui/button";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app } from "../../../../../Config/FirbaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from 'sonner';

// Timezone fetching
const fetchTimeZones = async () => {
  const apiKey = process.env.NEXT_PUBLIC_TIMEZONE_DB_API_KEY; // Use environment variable
  const url = `https://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Fetched timezone data:", data);

    if (data.zones && Array.isArray(data.zones)) {
      const timezones = data.zones.map((item) => ({
        value: item.zoneName,
        label: `${item.countryName} (${item.zoneName})`,
      }));
      timezones.sort((a, b) => a.label.localeCompare(b.label));
      return timezones;
    } else {
      console.error("Unexpected timezone data structure:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching timezone data:", error);
    return [];
  }
};

// Flag fetching
const fetchFlags = async () => {
  const url = "https://rest-countries10.p.rapidapi.com/countries";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY, // Use environment variable
      "x-rapidapi-host": "rest-countries10.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Full API response:", result);

    if (Array.isArray(result)) {
      const flags = result.map((item) => ({
        value: item.alpha2Code,
        label: item.name,
        flagUrl: item?.flags?.svg || item?.flags?.png,
      }));
      flags.sort((a, b) => a.label.localeCompare(b.label));
      return flags;
    } else {
      console.error("Unexpected flag data structure:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching flag data:", error);
    return [];
  }
};

// Main content
function NewContacts() {
  const [timezones, setTimezones] = useState([]);
  const [flags, setFlags] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactMail, setContactMail] = useState("");
  const [contactTimezone, setContactTimezone] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const { user } = useKindeBrowserClient();
  const db = getFirestore(app);

  const onCreateClick = async () => {
    const id = Date.now().toString();
    const newContact = {
      id: id,
      ContactName: contactName,
      ContactMail: contactMail,
      ContactTimezone: contactTimezone,
      ContactPhone: contactPhone,
      businessId: doc(db, "Business", user?.email),
      createdBy: user?.email,
    };
    try {
      await setDoc(doc(db, 'ContactDetails', id), {
        id: id,
        ContactName: contactName,
        ContactMail: contactMail,
        ContactTimezone: contactTimezone,
        ContactPhone: contactPhone,
        businessId: doc(db, 'Business', user?.email),
        createdBy: user?.email,
      }
      
      );
      toast('New Contact Created!');
    } catch (error) {
      console.error("Error creating document: ", error);
      toast('Error creating meeting event. Please try again.');
    }
  };

  useEffect(() => {
    Promise.all([fetchTimeZones(), fetchFlags()]).then(
      ([fetchedTimezones, fetchedFlags]) => {
        console.log("Parsed and sorted timezones:", fetchedTimezones);
        console.log("Parsed and sorted flags:", fetchedFlags);
        setTimezones(fetchedTimezones);
        setFlags(fetchedFlags);
      }
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'contactName':
        setContactName(value);
        break;
      case 'contactMail':
        setContactMail(value);
        break;
      case 'contactTimezone':
        setContactTimezone(value);
        break;
      case 'contactPhone':
        setContactPhone(value);
        break;
      default:
        break;
    }
  };

  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
    setContactTimezone(value);
  };

  const handleFlagChange = (value) => {
    setSelectedFlag(value);
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger>+ New Contact</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Fill Your Contact Details</SheetTitle>
            <SheetDescription>
              <div className="h-[90vh] flex flex-col justify-between">
                <div>
                  <div>
                    <h2 className="font-semibold text-lg py-2 text-black">
                      Name *
                    </h2>
                    <Input
                      name="contactName"
                      placeholder="Name of new contact"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg py-2 text-black">
                      Email *
                    </h2>
                    <Input
                      name="contactMail"
                      placeholder="Email id of new contact"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg py-2 text-black">
                      Timezone *
                    </h2>
                    <Select onValueChange={handleTimezoneChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="w-[20vw] ">
                          {timezones.map((timezone) => (
                            <SelectItem
                              key={timezone.value}
                              value={timezone.value}
                            >
                              {timezone.label}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg py-2 text-black">
                      Phone number *
                    </h2>
                    <div className="relative mt-2 max-w-xs text-gray-500">
                      <div className="absolute inset-y-0 my-auto left-1 h-6 flex items-center">
                        <DropdownMenu onValueChange={handleFlagChange}>
                          <DropdownMenuTrigger className="w-[60px] rounded-xl hover:bg-gray-200 bg-gray-100">
                            <h2 className="text-2xl">🇮🇳</h2>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {flags.map((flag) => (
                              <DropdownMenuItem
                                key={flag.value}
                                value={flag.value}
                              >
                                <Image
                                  src={flag.flagUrl}
                                  alt={flag.label}
                                  className="mr-2 h-5 w-5"
                                />
                                {flag.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Input
                        name="contactPhone"
                        type="tel"
                        placeholder="+1 (555) 000-000"
                        onChange={handleInputChange}
                        className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    className="w-full mt-9"
                    disabled={
                      !contactName ||
                      !contactPhone ||
                      !contactMail ||
                      !contactTimezone
                    }
                    onClick={onCreateClick}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default NewContacts;
