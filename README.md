[![A mockup of a phone with a Screenshot of SvelteLab opened. SvelteLab: A REPL for SvelteKit projects: quickly spin up a SvelteKit Projects and share it with the world!](./header.png)](https://www.sveltelab.dev/)

---

**✨ Features:**

- 🌗 Light / Dark Mode
- 🎨 Command Palette: <kbd>Ctrl / CMD</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
- 🧹 Code Formatting
- 📒 Templates (TypeScript, Tailwind, mdsvex)
- 📄 SvelteKit File Icons
- 🛤️ SvelteKit Route Generation
- ➕ [Svelte Add](https://github.com/svelte-add/svelte-add)
- 📦 Install Packages
- ⌨️ Vim Keybindings
- 👻 Hide Config Clutter (show file tree from `/src`)

🧡 Made with Svelte, for Svelte, by Svelte lovers!

🔌 Powered by SvelteKit, WebContainers, CodeMirror, Xterm.js and PocketBase

---

[🧪 Try it out now!](https://sveltelab.dev/)

[![](https://api.iconify.design/material-symbols:error-circle-rounded.svg?color=%23ff4000) Create New Issue](https://github.com/sveltelab/sveltelab/issues/new/choose)

[![](https://api.iconify.design/simple-icons:discord.svg?color=%23ff4000) Discord](https://discord.gg/FbnT6wujQx)

![](https://api.iconify.design/simple-icons:twitter.svg?color=%23ff4000) Twitter: [@PaoloRicciuti](https://twitter.com/PaoloRicciuti), [@SarcevicAntonio](https://twitter.com/SarcevicAntonio)

---

# FAQ

## Are my projects secure?

Simply put, no. SvelteLab not meant as a IDE for building real world applications, but for sharing Svelte expeirments. **Do not** use it to store private API keys or other secrets, as all contents will be saved or shared as plaintext.

## Where can I enable Vim Keybindings?

Use the command palette to enable Vim Keybindings! Press <kbd>Ctrl / CMD</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> and search for "Vim".

## Why not just use StackBlitz or similar?

Our aim isn't to create a fully fledged online web dev development environment as StackBlitz and other tools do that already.

We wanted to create something that has the ease of use of the Svelte REPL, but allows for more types of experiments that require SvelteKit because of routing or other features. We also wanted to provides features that we craved for the REPL like dark mode and code formatting.

Therefore we aim on providing a focused user interface for quickly building and sharing SvelteKit explorations, building on the same WebContainer API that also powers StackBlitz while providing useful features in a command palette.

---

# Development

> **Note**
> If you are using an AdBlocker like uBlock Origin, you might have to disable it while developing due to the Vercel Analytics script.

```
cp .env.sample .env
pnpm i
pnpm dev
```
