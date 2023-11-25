import "@react-native-firebase/messaging";
import { firebase } from "@react-native-firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDG61L2rizoyTDIwsmBI7RlRsGVsXJcsx8",
  authDomain: "schoolappfcm.firebaseapp.com",
  projectId: "schoolappfcm",
  storageBucket: "schoolappfcm.appspot.com",
  messagingSenderId: "1031018103071",
  appId: "1:1031018103071:web:e41684e139aa72cd63f02a",
  measurementId: "G-5YV80JM5NK",
};

firebase.initializeApp(firebaseConfig);
