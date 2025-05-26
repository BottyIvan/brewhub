"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Item from "@/components/item";
import Pagination from "@/components/pagination";

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

const ItemList: React.FC = () => {
  const [items, setItems] = useState<MappedItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch("/api/formulas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: currentPage,
        limit: 500,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log("Fetched data:", data);
        const mapped = await Promise.all(
          data.data.map(async (item: ItemType) => {
            let favicon = "";
            if (item.homepage) {
              try {
                const url = new URL(item.homepage);
                favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
              } catch {
                favicon = "";
              }
            }
            return {
              id: uuidv4(),
              title: item.full_name,
              description: item.desc,
              image: favicon,
              href: `/formula/${item.name}`,
              verified: !item.deprecated && !item.disabled,
            };
          })
        );
        setCurrentPage(data.page);
        setTotalPages(data.pages);
        setItems(mapped);
        setLoading(false);
      });
  }, [currentPage]);

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
        <div className="sticky bottom-0 z-30 mt-8 flex justify-center items-center py-3 backdrop-blur-2xl">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-4"
          />
        </div>
      )}
    </>
  );
};

export default ItemList;
