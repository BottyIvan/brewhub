declare global {
  interface Window {
    electron?: {
      runBrew: (args: string[]) => Promise<{ output?: string; error?: string }>;
    };
  }
}
export {};
