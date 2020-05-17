This project is a React-Native project

To run, you must first install expo. You can do this by running:

### `npm install expo-cli -g`

## Required Libraries

To install all dependencies, you can run:

npm install --save @react-native-community/netinfo @types/react-native-keyboard-spacer expo-image-picker expo-location expo-permissions firebase prop-types react react-dom react-native react-native-gesture-handler react-native-gifted-chat react-native-keyboard-spacer react-native-maps react-native-web react-navigation react-navigation-stack

You can then get the app to start by running:

### `npm start`

This will launch DevTools on port 19002. You can then run the app on a physical device or emulator by either scanning the QR code or by creating and signing into an expo account. To run on your device, you can download and install the expo app from the app store.</br>

For information on how to set up an emulator for testing, you can visit [this page](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/). You can then press "Run on Android device/emulator" in the DevTools to launch the app on your emulator.

## Setup firebase account

You should also set up firebase account for your own use. To do this follow these steps: </br>

1. go [here](https://firebase.google.com/?hl=en)

2. sign into your google account</br>

3. click on "Go to console"</br>

4. click "add project"</br>

5. follow onscreen instructions until it says "creating your project"</br>

6. click on "database" on the Develop tab </br>

7. click on "Create Database" and select "start in test mode"</br>

8. click on "start collection" and name it "messages" and then press "auto id" and confirm on the following screen</br>

9. click on "Authentication", "set up sign-in method" and enable anonymous authentication</br>

10. click on "storage" to set up cloud storage</br>

11. finally, click on the gear just above the Develop tab, and select "project settings". Click on the button that will add Firebase to a web app, name it, and copy everything in the firebaseConfig and paste into the Chat.js file.</br>

[Kanban board](https://trello.com/b/7bDIpLAt/native-react-chat-app)