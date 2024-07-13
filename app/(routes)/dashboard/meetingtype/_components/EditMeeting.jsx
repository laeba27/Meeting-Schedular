import React from "react";
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
function EditMeeting() {
  return (
    <div>

      <Dialog>
        <DialogTrigger className="flex items-center justify-start gap-4 px-2 hover:font-semibold" >
        <Pen className="h-4 w-4" />
        Edit  
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditMeeting;
