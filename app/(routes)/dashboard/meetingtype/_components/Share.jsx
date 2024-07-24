"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { CopyPlusIcon } from "lucide-react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../../../../Config/FirbaseConfig";
import { FaWhatsapp, FaTwitter, FaPinterestP } from 'react-icons/fa'; // Correct icon imports
import Image from "next/image";

function Share({ meetingId }) {
  const [meetingURL, setMeetingURL] = useState("");
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "MeetingEvent", meetingId); // Update this with your actual collection and document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMeetingURL(docSnap.data().meetingURL);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    if (meetingId) {
      fetchData();
    }
  }, [db, meetingId]);

  const handleShare = (platform) => {
    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(meetingURL)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(meetingURL)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(meetingURL)}`;
        break;
        case "email":
        shareUrl = `mailto:?subject=Meeting Link&body=${encodeURIComponent(meetingURL)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h2>Share</h2>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            {loading ? "Loading..." : "Anyone who has this link will be able to view this."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={meetingURL}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(meetingURL);
              alert("Link copied to clipboard!");
            }}
          >
            <span className="sr-only">Copy</span>
            <CopyPlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex space-x-9">
          <div
         className="hover:backdrop-sepia hover:bg-white/30  "
            type="button"
            size="sm"
            onClick={() => handleShare("whatsapp")}
          >
            <Image src="/whatsapp.png" alt="whatsapp" height={60} width={60}  />
            <span className="sr-only">Share on WhatsApp</span>
          </div>
          <div
            type="button"
            size="sm"
            onClick={() => handleShare("email")}
          >
            <Image src="/gmail.png" alt="gmail" height={60} width={60} />
            <span className="sr-only">Share on WhatsApp</span>
          </div>
          <div
            type="button"
            size="sm"
            onClick={() => handleShare("twitter")}
          >
            <Image src="/x.png" alt="x" height={60} width={60} />
            <span className="sr-only">Share on Twitter</span>
          </div>
          <div
            type="button"
            size="sm"
            onClick={() => handleShare("pinterest")}
          >
           <Image src="/pinterest.png" alt="pinterest" height={60} width={60} />
            <span className="sr-only">Share on Pinterest</span>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Share;
