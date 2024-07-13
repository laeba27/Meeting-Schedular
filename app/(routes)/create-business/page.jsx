"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { app } from "../../../Config/FirbaseConfig";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
function CreateBusiness() {

    
  const [businessName, setBusinessName] = useState();
  const db = getFirestore(app); // Initialize Cloud Firestore and get a reference to the service
  const { user } = useKindeBrowserClient();
  const router=useRouter();

  const onCreateBusiness = async () => {
    console.log( businessName);
    await setDoc(doc(db, "Business", user.email), {
      businessName: businessName,
      email: user.email,
      userName: user.given_name + " " + user.family_name,
    }).then(resp=>{
        console.log("Document saved")
        toast('New Business Created!')
        router.replace('/dashboard');
    })
  };


  return (
    <div className="p-14 items-center flex flex-col gap-20 my-10">
      <Image src="/logo.svg" alt="logo" width={200} height={200} />
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h2 className="text-4xl font-bold">
          What should we call your business?
        </h2>
        <p className="text-slate-500">
          You can always change this later from settings
        </p>

        <div className="w-full">
          <label className="text-slate-400">Team Name</label>
          <Input
            placeholder="Ex. Kreanto"
            className="mt-2"
            onChange={(event) => setBusinessName(event.target.value)}
          />
        </div>
        
        <Button
          className="w-full"
          disabled={!businessName}
          onClick={onCreateBusiness}
        >
          Create Business
        </Button>
      </div>
    </div>
  );
}

export default CreateBusiness;
