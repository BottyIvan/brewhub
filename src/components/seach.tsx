"use client";

import React from "react";
import { useSearch } from "@/context/search";

const SearchBar: React.FC = () => {
  const { query, setQuery } = useSearch();

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
