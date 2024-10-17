'use client'
import DaysList from "../../../_utils/DaysList";
import React from "react";
import { Checkbox } from "../../../../components/ui/checkbox"
import UpcommingMeeting from "./_components/UpcommingMeeting"
import PrevMeeting from "./_components/PrevMeeting"
import CancelledMeeting from "./_components/CancelledMeeting"

function Scheduled() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Scheduled Meeting</h2>
      <hr className="my-7"></hr>
      <div>
        <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2 lg:gap-8">
  <div className="h-32 p-4 rounded-lg border border-gray-400">
    <UpcommingMeeting/>
  </div>
  <div className="h-32 p-4 rounded-lg border border-gray-400 ">
    <PrevMeeting/>
  </div>
  {/* <div className="h-32 p-4 rounded-lg border border-gray-400">
    <CancelledMeeting/>
  </div> */}
</div>
      </div>
    </div>
  );
}

export default Scheduled;
