import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ItemProps {
  href: string;
  image: string;
  title: string;
  description: string;
  verified?: boolean;
}

export const Item: React.FC<ItemProps> = ({
  href,
  image,
  title,
  description,
  verified = false,
}) => (
  <article className="h-full">
    <Link
      aria-label={title}
      title={description}
      className="flex min-w-0 items-center gap-4 duration-500 hover:cursor-pointer hover:no-underline h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 p-4"
      href={href}
    >
      <div className="relative flex h-[64px] w-[64px] shrink-0 flex-wrap items-center justify-center rounded drop-shadow-md md:h-[96px] md:w-[96px] bg-gradient-to-br from-white to-violet-50">
        <Image
          alt={`${title} Logo`}
          loading="lazy"
          width={25}
          height={25}
          src={image}
          className="object-contain"
          style={{ color: "transparent", maxWidth: "100%" }}
        />
      </div>
      <div className="flex flex-col justify-center overflow-hidden">
        <div className="flex gap-1 items-center">
          <h3 className="truncate whitespace-nowrap text-base font-semibold text-gray-900 dark:text-gray-100 m-0">
            {title}
          </h3>
          {verified && (
            <span
              className="size-6 flex justify-center items-center"
              aria-label="App verificata"
              title="App verificata"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="size-5 text-blue-500"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          )}
        </div>
        <p
          className="mt-1 line-clamp-2 text-sm text-gray-900 dark:text-gray-100 md:line-clamp-3"
          id={`desc-${title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          {description}
        </p>
      </div>
    </Link>
  </article>
);

export default Item;
