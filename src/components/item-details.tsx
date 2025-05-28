"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type FormulaDetails = {
  name: string;
  full_name?: string;
  desc: string;
  image?: string;
  license?: string;
  homepage: string;
  versions: {
    stable: string;
    head?: string;
  };
  urls?: {
    stable?: { url: string; checksum?: string };
    head?: { url: string; branch?: string };
  };
  dependencies?: string[];
  build_dependencies?: string[];
  installed?: Array<{ version: string }>;
  deprecated?: boolean;
  disabled?: boolean;
  bottle?: unknown;
  tap?: string;
  analytics?: {
    install?: { [period: string]: { [name: string]: number } };
  };
};

interface Props {
  readonly formulaName: string;
}

export default function FormulaDetail({ formulaName }: Props) {
  const [formula, setFormula] = useState<FormulaDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch formula details when the component mounts or formulaName changes
  useEffect(() => {
    /**
     * Fetches the formula data for the specified formula name from the API.
     *
     * This asynchronous function calls the `/api/formula/{formulaName}` endpoint,
     * parses the response as JSON, updates the component state with the fetched data,
     * and sets the loading state to false upon completion.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when the formula data has been fetched and state updated.
     */
    const fetchFormula = async () => {
      const res = await fetch(`/api/formula/${formulaName}`);
      const data = await res.json();
      // Try to generate a favicon URL from the homepage
      let favicon: string | undefined;
      if (data.homepage) {
        try {
          const url = new URL(data.homepage);
          favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
        } catch {
          favicon = undefined;
        }
      }
      // Attach favicon to the data object (if you want to use it elsewhere)
      setFormula({ ...data, image: favicon });
      setLoading(false);
    };
    fetchFormula();
  }, [formulaName]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  if (!formula)
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Formula not found</p>
      </div>
    );

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 2xl:grid-cols-details2xl gap-8">
        <header className="flex flex-col sm:flex-row items-center gap-7 py-7 p-6  rounded-2xl shadow-lg">
          <div className="relative flex h-[64px] w-[64px] shrink-0 flex-wrap items-center justify-center rounded-xl drop-shadow-md md:h-[96px] md:w-[96px] bg-gradient-to-br from-white to-violet-50">
            <Image
              alt={`${formula.name} Logo`}
              aria-hidden="true"
              loading="lazy"
              width={25}
              height={25}
              src={formula.image ?? "/images/default-logo.png"}
              className="object-contain"
              style={{ color: "transparent", maxWidth: "100%" }}
            />
          </div>
          <div className="flex flex-col my-auto gap-2 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold truncate">
                {formula.full_name ?? formula.name}
              </h1>
              {formula.deprecated && (
                <span className="ml-2 px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-semibold">
                  Deprecated
                </span>
              )}
              {formula.disabled && (
                <span className="ml-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 font-semibold">
                  Disabled
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formula.tap}</span>
              {formula.license && (
                <>
                  <span className="mx-1">•</span>
                  <span>
                    License: <b>{formula.license}</b>
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
                href={formula.homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z"
                  />
                </svg>
                Homepage
              </a>
              {formula.urls?.stable?.url && (
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 text-white font-semibold text-xs hover:bg-green-700 transition"
                  type="button"
                  onClick={() =>
                    window.open(
                      formula.urls?.stable?.url ?? "#",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                    />
                  </svg>
                  Download stable
                </button>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-col gap-6 col-span-1">
          <section className="rounded-xl shadow-md dark:bg-gray-800 bg-white p-6">
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Description
            </h2>
            <div className="prose dark:prose-invert xl:max-w-[75%] text-gray-800 dark:text-gray-200">
              <p>{formula.desc}</p>
            </div>
          </section>
          <section className="rounded-xl shadow-md dark:bg-gray-800 bg-white p-6 flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Stable version
                </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {formula.versions.stable}
                </span>
              </div>
              {formula.versions.head && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Head version
                  </span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {formula.versions.head}
                  </span>
                </div>
              )}
              {formula.installed && formula.installed.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Installed
                  </span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {formula.installed.map((i) => i.version).join(", ")}
                  </span>
                </div>
              )}
              {formula.urls?.stable?.checksum && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Checksum
                  </span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">
                    {formula.urls.stable.checksum}
                  </span>
                </div>
              )}
            </div>
            {formula.dependencies && formula.dependencies.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Dependencies
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formula.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-xs font-medium text-blue-800 dark:text-blue-200"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {formula.build_dependencies &&
              formula.build_dependencies.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Build dependencies
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formula.build_dependencies.map((dep) => (
                      <span
                        key={dep}
                        className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs font-medium"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            {formula.urls?.head?.url && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Head source
                </span>
                <a
                  href={formula.urls.head.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 dark:text-blue-300 hover:underline break-all font-mono"
                >
                  {formula.urls.head.url}
                </a>
              </div>
            )}
          </section>
          {formula.analytics?.install && (
            <section className="rounded-xl shadow-md dark:bg-gray-800 bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <svg
                  className="w-5 h-5 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v-2a4 4 0 014-4h3m4 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Install Statistics
              </h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(formula.analytics.install).map(
                  ([period, data]) => (
                    <div
                      key={period}
                      className="flex-1 min-w-[180px] max-w-xs rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                      <div className="mb-1 text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
                        <span className="uppercase tracking-wide">Period:</span>
                        <span className="font-mono text-blue-700 dark:text-blue-300">
                          {period}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {Object.entries(data).map(([name, count]) => (
                          <div
                            key={name}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-mono text-gray-700 dark:text-gray-200 truncate">
                              {name}
                            </span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {count.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
