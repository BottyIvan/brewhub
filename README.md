# BrewHub

> [!NOTE]
> 🚀 **For macOS users:**  
> Before opening the app for the first time, you need to run the following command to remove quarantine attributes:
> 
> ```bash
> xattr -rc /Applications/BrewHub.app
> ```

BrewHub is a web and desktop app built with [Next.js](https://nextjs.org/) and Electron that lets you explore, search, and manage [Homebrew](https://brew.sh/) formulas.  
With BrewHub you can:

- Quickly search any Homebrew formula with advanced search
- View complete details: version, dependencies, license, install stats, and supported architectures
- Analyze dependencies between formulas
- See popularity and installation statistics
- Manage installed formulas directly from the desktop app (install, update, uninstall)
- Enjoy a modern user experience: dark mode, responsive, optimized for every device

## Main Features

- **Advanced search**: find any Homebrew formula in real time
- **Formula details**: full info including changelog, dependencies, versions, and analytics
- **Install management**: install, update, and uninstall formulas directly from the desktop app (Electron only)
- **Statistics**: view installation and popularity data
- **User experience**: polished interface, dark mode, mobile and desktop optimization

## Project Dependencies

Main dependencies:
- [Next.js](https://nextjs.org/) `15.3.2`
- [React](https://react.dev/) `^19.0.0`
- [Electron](https://www.electronjs.org/) `^36.4.0`
- [@heroicons/react](https://github.com/tailwindlabs/heroicons) `^2.2.0`
- [uuid](https://github.com/uuidjs/uuid) `^11.1.0`
- [dotenv](https://github.com/motdotla/dotenv) `^16.5.0`

Dev dependencies:
- [electron-forge](https://www.electronforge.io/) `^7.8.1`
- [eslint](https://eslint.org/) `^9`
- [tailwindcss](https://tailwindcss.com/) `^4`
- [typescript](https://www.typescriptlang.org/) `^5`
- and more (see `package.json` for the full list)

## License

This project is licensed under the [MIT License](LICENSE).

## Getting Started

To start the web development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

To start the desktop version (Electron):

```bash
npm run start
```

## Contributing

Contributions, bug reports, and suggestions are welcome! Open an issue or pull request on [GitHub](https://github.com/ivanbottigelli/brewhub).

## Deploy on Vercel

The easiest way to deploy the web app is via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Homebrew Formulae](https://formulae.brew.sh/)

