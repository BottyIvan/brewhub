import Navigation from "@/components/navigation";
import ItemList from "@/components/item-list";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="backdrop-blur-2xl sticky top-0 z-50">
        <Navigation />
      </header>
      <main className="flex min-h-screen flex-col items-center py-10">
        <div className="w-full max-w-7xl px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 z-10 relative">
            Discover Apps
          </h1>
          <ItemList />
        </div>
      </main>
      <footer className="w-full py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} BrewHub. All rights reserved.
      </footer>
    </div>
  );
}
