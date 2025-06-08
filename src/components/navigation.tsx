import React from "react";
import Link from "next/link";
import SearchBar from "./seach";
import { WalletIcon } from "@heroicons/react/16/solid";

const Navigation: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
        {/* Logo */}
        <div className="flex md:absolute md:inset-y-0 md:start-0 lg:static xl:col-span-4">
          <div className="flex h-full w-full shrink-0 items-center">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-900 dark:text-white transition hover:bg-gray-100 dark:hover:bg-gray-800 lg:w-fit lg:py-2 lg:pe-[14px] lg:ps-3"
              title="Vai alla Home"
            >
              <span className="hidden lg:block text-2xl font-bold">
                Brewhub
              </span>
              <span className="block lg:hidden text-xl font-bold">B</span>
            </Link>
          </div>
        </div>
        {/* SearchBar */}
        <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-4 flex items-center px-6 py-0 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0 h-full">
          <div className="w-full xl:mx-auto xl:w-[400px] flex items-center justify-center h-full">
            <SearchBar />
          </div>
        </div>
        {/* Desktop Links */}
        <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
          <Link
            href="/formule"
            className="ms-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-900 dark:text-white transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <WalletIcon className="me-2 h-5 w-5" />
          </Link>
        </div>
        {/* Mobile Menu Button */}
        <div className="flex items-center md:absolute md:inset-y-0 md:end-0 lg:hidden">
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 dark:text-white transition hover:bg-gray-100 dark:hover:bg-gray-800"
            type="button"
          >
            <span className="sr-only">Apri menu</span>
            <svg
              className="block size-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
