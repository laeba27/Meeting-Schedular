"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

import NewContacts from "./_components/NewContacts";
import { getFirestore, collection, getDocs , deleteDoc, doc } from "firebase/firestore";
import { app } from "../../../../Config/FirbaseConfig";
import { toast } from "sonner";
import { FileVideo2, EllipsisVertical, MessageCircleMore , Trash , Pen} from "lucide-react";

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [CreateContact, setCreateContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const db = getFirestore(app);

  const handleShowContactForm = () => {
    setCreateContact(true);
  };

  // Fetch contacts from Firestore
  const fetchContacts = async () => {
    try {
      setIsLoading(true); // Start loading
      const querySnapshot = await getDocs(collection(db, "ContactDetails"));
      const fetchedContacts = querySnapshot.docs.map((doc) => doc.data());
      setContacts(fetchedContacts);
      setIsLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching contacts: ", error);
      toast.error("Failed to load contacts. Please try again.");
      setIsLoading(false);
    }
  };

    // Delete contact from Firebase
    const handleDeleteContact = async (contactId) => {
      try {
        await deleteDoc(doc(db, "ContactDetails", contactId)); // Delete contact by ID
        toast.success("Contact deleted successfully.");
        fetchContacts(); // Refresh the contact list after deletion
      } catch (error) {
        console.error("Error deleting contact: ", error);
        toast.error("Failed to delete contact. Please try again.");
      }
    };

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Callback to refresh contacts after new contact creation
  const handleContactCreated = () => {
    fetchContacts(); // Fetch the updated contacts after a new one is created
  };

  return (
    <div className="p-6 px-10 flex flex-col gap-5">
      <h2 className="font-bold text-3xl">Contacts</h2>
      <div className="flex justify-between">
        <Input placeholder="Search" className="max-w-xs" />

        <NewContacts onContactCreated={handleContactCreated} />
      </div>

      <hr />

      {isLoading ? (
        <p>Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <TableCaption>
          <h2 className="text-base max-w-2xl">
            You don’t have any contacts. People that you meet with will
            automatically be saved as a contact or you can{" "}
            <span
              onClick={handleShowContactForm}
              className="text-blue-600 underline underline-offset-8 cursor-pointer"
            >
              create a new contact
            </span>
            {CreateContact && (
              <div>
                <NewContacts onContactCreated={handleContactCreated} />
              </div>
            )}
          </h2>
        </TableCaption>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Timezone</TableHead>
              <TableHead></TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium capitalize">
                  {contact.ContactName}
                </TableCell>
                <TableCell>{contact.ContactMail}</TableCell>
                <TableCell>{contact.ContactPhone}</TableCell>
                <TableCell>{contact.ContactTimezone}</TableCell>

                <TableCell className="text-indigo-800 flex gap-2  items-center cursor-pointer hover:underline">
                  <FileVideo2 className="h-5 w-5" /> + Book meeting
                </TableCell>
                <TableCell className="cursor-pointer">
                  <MessageCircleMore className="h-4 w-4" />
                </TableCell>
                <TableCell className="cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="flex gap-2"> 
                      <Pen className="h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex gap-2" onClick={() => handleDeleteContact(contact.id)}> 
                      <Trash className="h-4 w-4 " /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Contact;
