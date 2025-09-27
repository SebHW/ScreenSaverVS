# Hello Joe, below

# ScreenSaverVs — Dev Setup (Android, Expo + Dev Client)

This project uses **Expo Router** and a **Development Build** (a custom Expo Go that includes our native code).
You’ll run Metro locally and load the JS bundle into the dev client on your emulator/phone. I know u probs don't have an emulator, but you can install Android Studio and run an emulator on that or just put it on your phone.

## 0) Prerequisites

- **Node.js 18+** and **npm** or **yarn**
- **Git**
- **Android Studio** (if you are going to use an emulator)

  - Open Android Studio once → _More Actions → SDK Manager_ → install latest **SDK Platform** + **Android SDK Build-Tools**
  - _More Actions → Virtual Device Manager_ → create a Pixel emulator with Google APIs (any recent Android)
  - Can just follow this video if u like cos I feel like that will keep your monkey brain more engaged https://www.youtube.com/watch?v=0-H7ZlaQAOc

---

## 1) Clone & install

```bash
git clone https://github.com/SebHW/ScreenSaverVS.git
cd screensavervs
npm install
```

---

## 2) Start Metro (JS dev server)

Open the folder in VSCode, open two bash terminals. In one terminal:

```bash
npx expo start
```

Leave this running. You’ll connect the dev client to this server in a HOT SEC.

---

## 3) Build & install the Android **development build**

One day we will make a _cloud_ build so it is downloadable on different devices from one place, but today is not that day and I am not that guy. Open the other terminal that u opened.

> IMPORTANT: If /andriod doesn't exist in the repo, then run the command beneath this one. But if it does can skip to this command

```bash
npx expo prebuild --platform android
```

Now we have /android Then start your emulator (**Android Studio → Device Manager → Start**) or plug in a phone with **USB debugging** enabled, and run:

```bash
npx expo run:android
```

This compiles locally, installs the app on the emulator/phone, and opens the **Expo Dev Client**.

---

## 4) Connect the dev client to Metro

On the device/emulator you just installed:

1. Open the **ScreenSaverVs (Development Build)** app.
2. Tap **“Fetch development servers”** → select your local server (should just be an ip with a green circle next to it).

   - If it doesn’t appear, tap **“Enter URL manually”** and paste the URL shown in the `npx expo start` terminal.

That’s it — the app loads your JS bundle. Edits in your code reload instantly.

---

## 5) Everyday workflow

- JS/TS changes → **no rebuild needed**. Keep `npx expo start` running.
- **Only rebuild the dev client** with npx expo prebuild --platform android when you:

  - add/modify **native code** (Android/Kotlin, Gradle)
  - change **AndroidManifest**/app config that affects native.

- One day the andoird build files will be removed but for ismplicity I ain't doing that

---
