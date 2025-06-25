"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Item from "@/components/item";
import Pagination from "@/components/pagination";
import { useSearch } from "@/context/search";

interface ItemType {
  id: string;
  name: string;
  full_name: string;
  desc: string;
  homepage: string;
  deprecated: boolean;
  disabled: boolean;
}

interface MappedItemType {
  id: string;
  title: string;
  description: string;
  image?: string;
  href: string;
  verified: boolean;
}

interface ItemListProps {
  enableInstalledCheck?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({
  enableInstalledCheck = false,
}) => {
  const [items, setItems] = useState<MappedItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { query } = useSearch();

  useEffect(() => {
    setLoading(true);

    const getInstalledFormulas = async (names: string[]) => {
      if (typeof window !== "undefined" && window.electron?.runBrew) {
        const result = await window.electron.runBrew([
          "list",
          "--versions",
          ...names,
        ]);
        // result.output is a string with installed formula names and versions
        // Split by line and extract the formula name
        const installed = (result.output ?? "")
          .split("\n")
          .map((line) => line.split(" ")[0])
          .filter(Boolean);
        return new Set(installed);
      }
      return new Set<string>();
    };

    /**
     * Fetches a paginated list of formulas from the `/api/formulas` endpoint using a POST request.
     * Maps the received data to the `MappedItemType` structure, including generating a favicon URL
     * from the item's homepage if available. Updates the component state with the mapped items,
     * current page, and total pages. Handles errors by logging them and resetting the items list.
     * Sets the loading state to false when the operation completes.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>} A promise that resolves when the data fetching and state updates are complete.
     */
    const fetchData = async () => {
      try {
        let bodyRequest: unknown = {
          query: query,
          page: currentPage,
          limit: 500,
        };

        // If installed check is enabled, retrieve the list of installed formulas
        if (enableInstalledCheck) {
          // Retrieve the list of installed formulas
          const installedSet = await getInstalledFormulas([]);
          // Convert it to an array
          const installedList = Array.from(installedSet);
          // Send the list to the API
          bodyRequest = { formulas: installedList };
        }

        // Prepare the POST request options
        const requestInit: RequestInit = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyRequest),
        };

        // Fetch data from the API
        const res = await fetch(`/api/formulas`, requestInit);

        // Throw error if response is not OK
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        // Parse the JSON response
        const data = await res.json();

        // Map the API data to the MappedItemType structure
        const mapped: MappedItemType[] = Array.isArray(data.data)
          ? data.data.map((item: ItemType) => {
              let favicon: string | undefined;
              // Try to generate a favicon URL from the homepage
              if (item.homepage) {
                try {
                  const url = new URL(item.homepage);
                  favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
                } catch {
                  favicon = undefined;
                }
              }
              return {
                id: uuidv4(),
                title: item.full_name || item.name,
                description: item.desc || "",
                image: favicon,
                href: `/formula/${encodeURIComponent(item.name)}`,
                verified: Boolean(!item.deprecated && !item.disabled),
              };
            })
          : [];

        // Update state with the mapped items and pagination info
        setItems(mapped);
        setCurrentPage(data.page);
        setTotalPages(data.pages);
      } catch (error) {
        // Log and handle errors
        console.error("Error fetching data:", error);
        setItems([]);
      } finally {
        // Always set loading to false at the end
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, query, enableInstalledCheck]);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map(() => (
              <div
                key={`skeleton-placeholder-${uuidv4()}`}
                className="animate-pulse bg-gray-200 rounded-lg h-48 w-full"
              />
            ))
          : items.map((item) => (
              <Item
                key={item.id}
                href={item.href}
                image={item.image ?? ""}
                title={item.title}
                description={item.description}
                verified={item.verified}
              />
            ))}
      </div>
      {totalPages > 1 && (
        <div className="sticky bottom-0 z-30 mt-8 py-3 flex justify-center items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="rounded-full backdrop-blur-2xl mx-auto p-3"
          />
        </div>
      )}
    </>
  );
};

export default ItemList;
