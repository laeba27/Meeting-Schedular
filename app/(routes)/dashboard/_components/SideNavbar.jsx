"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Briefcase, Calendar, Clock, Plus, Settings } from "lucide-react";
import { usePathname } from 'next/navigation'
import  { useEffect, useState } from 'react'
function SideNavbar() {
  const menu = [
    {
      id: 1,
      name: "Meeting Type",
      path: "/dashboard/meetingtype",
      icon: Briefcase,
    },
    {
      id: 2,
      name: "Scheduled Meeting",
      path: "/dashboard/scheduled-meeting",
      icon: Calendar,
    },
    {
      id: 3,
      name: "Availability",
      path: "/dashboard/availability",
      icon: Clock,
    },
    {
      id: 4,
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const path=usePathname();
  const [activepath, setactivepath] = useState(path)
  useEffect(() => {
    path&&setactivepath(path)
  }, [ path])
  return (
    <div className="p-5 py-14  ">
      <div className="flex justify-center">
      <Link href={'/dashboard'}>
      <Image src="/logo.svg" width={150} height={150} alt="logo" />
      </Link>
       
      </div>
      <div>
      <Link href={'/create-meeting'}>
      <Button className="flex gap-2 w-full rounded-full mt-7">
          <Plus />
          Create
        </Button>
      </Link>
        
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {menu.map((item, index) => (
          <Link key={index} href={item.path}>
            <Button
              variant="ghost"
              className={`w-full flex gap-2 
                        justify-start
                        hover:bg-blue-100
                        font-normal
                        text-lg
                        ${activepath == item.path &&            
                         "text-primary bg-blue-100"}
                        `}>
              <item.icon /> {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNavbar;
