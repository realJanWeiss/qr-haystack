# Qr Haystack 🌾

Have you ever searched for the proverbial needle in a haystack? Turn it into a bit of fun and play “Qr Haystack”!

## How it works
1. Print out the [PDF](./game-cards.pdf) and cut out the QR codes.
2. Toss them all into a pile so your table looks like it’s never been tidied up.
3. Grab your Android, iOS, or any other device with a camera and web browser. Open the [webapp](https://qr-haystack.w3iss.com/) and ...

Happy hunting!

## From haystack to tech stack
The web app was built with Nuxt 3 and is statically generated. No server functions are required, so the application can be hosted in a resource-efficient way. Camera input is processed directly in the browser using the Node module [html5-qrcode](https://github.com/mebjas/html5-qrcode), which in turn uses the [Zxing-js](https://github.com/zxing-js/library) library. The codebase is written entirely in TypeScript.

## Setup

Make sure to install the dependencies:

```bash
pnpm i
```

## Development Server

Start the development server on `https://localhost:3000`:

```bash
pnpm dev
```

You need to trust the certificate. The webapp has to run on https so that the camera can be accessed.
