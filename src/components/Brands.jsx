import { Icon } from 'lucide-react';
import React from 'react';
import {FaApple, FaAmazon, FaGoogle } from 'react-icons/fa';
import { SiKfc, SiWalmart } from 'react-icons/si';
import { IoLogoYoutube } from "react-icons/io5";

const Brands = () => {
  const brandIcons = [
    { name: 'Apple',Icon: FaApple },
    { name: 'KFC', Icon: SiKfc },
    { name: 'Youtube',Icon: IoLogoYoutube},
    { name: 'Amazon', Icon: FaAmazon },
    { name: 'Google', Icon: FaGoogle },
    { name: 'Walmart', Icon: SiWalmart },
  ];

  return (
    <div className="container mx-auto max-w-screen-lg px-4 p-8 md:p-16 bg-gray">
      <div className="flex justify-center gap-2 items-center flex-wrap">
        {brandIcons.map(({ name, Icon }) => (
          <Icon key={name} className="h-10 w-auto mx-4 my-2 text-black" title={name} />
        ))}
      </div>
    </div>
  );
};

export default Brands;