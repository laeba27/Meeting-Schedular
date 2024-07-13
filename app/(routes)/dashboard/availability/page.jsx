'use client'
import DaysList from "../../../_utils/DaysList";
import React from "react";
import { Checkbox } from "../../../../components/ui/checkbox"


function Availability() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Availability</h2>
      <hr className="my-7"></hr>
      <div>
        <h1 className='font-bold'>Availability days</h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5 my-3'>
          {DaysList.map((item , index)=>(
            <div key={index}>
              <h2>
              <Checkbox /> {"  "}{item.day}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Availability;
