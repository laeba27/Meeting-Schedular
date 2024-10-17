// Header.jsx
"use client";
import { Button } from "../../components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div>
      <div className="flex items-center justify-between shadow-sm p-5">
        <Image
          src="/logo.svg"
          width={70}
          height={70}
          alt="logo"
          className="w-[10px] md:w-[200px]"
        />
        <ul className="md:flex hidden gap-14">
          <li className="hover:text-primary transition-all duration-300 cursor-pointer font-medium">
            Product
          </li>
          <li className="hover:text-primary transition-all duration-300 cursor-pointer font-medium">
            Pricing
          </li>
          <li className="hover:text-primary transition-all duration-300 cursor-pointer font-medium">
            Contact us
          </li>
          <li className="hover:text-primary transition-all duration-300 cursor-pointer font-medium">
            About us
          </li>
        </ul>
        <div className="flex gap-5">
          <LoginLink>
            <Button variant="ghost">Login</Button>
          </LoginLink>
          <RegisterLink>
            <Button>Get Started</Button>
          </RegisterLink>
        </div>
      </div>
    </div>
  );
}

export default Header;