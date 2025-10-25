"use client";

import { useRef, useState } from "react";
import { NetworkOptions } from "./NetworkOptions";
import { useDisconnect } from "wagmi";
import { ArrowLeftOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/helper";

export const WrongNetworkDropdown = () => {
  const { disconnect } = useDisconnect();
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };

  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <details ref={dropdownRef} className="relative mr-2">
      <summary className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-500 rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 shadow-lg list-none">
        <span className="text-white font-medium">Wrong network</span>
        <ChevronDownIcon className="h-5 w-4 text-white" />
      </summary>
      <ul className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
        <NetworkOptions />
        <li>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-700 transition-colors duration-200"
            type="button"
            onClick={() => disconnect()}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </details>
  );
};
