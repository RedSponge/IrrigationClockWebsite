import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
const { createApp } = Vue;

const firebaseConfig = {
  apiKey: "AIzaSyByUsybfnJ60EBts_nngbSAjOWjNjzdb28",

  authDomain: "waterclock.firebaseapp.com",

  databaseURL:
    "https://waterclock-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "waterclock",
  storageBucket: "waterclock.appspot.com",
  messagingSenderId: "19123305604",
  appId: "1:19123305604:web:6f65cdf38e89297b6c96d1",
};

const fbApp = initializeApp(firebaseConfig);
// const fbAuth = getAuth(fbApp);
// const fbDb = getDatabase(fbApp);

// signInWithEmailAndPassword(fbAuth, "test@test.test", "testtesttest")
//   .then((userCredential) => {
//     const user = userCredential.user;
//     const planRef = ref(fbDb, `Users/${user.uid}/Plans`);
//     console.log(planRef);
//     get(planRef).then((snapshot) => {
//       const data = snapshot.val();
//       console.log(data);
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });

import { LoginScreen } from "./components/LoginScreen.js";
import { PlanScreen } from "./components/PlanScreen.js";
import { PlanEntry } from "./components/PlanEntry.js";
import { DaySelector } from "./components/DaySelector.js";

const routes = [
  { path: "/", component: LoginScreen },
  { path: "/plans", component: PlanScreen },
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

const app = createApp({
  data() {
    return {
      firebase: fbApp,
    };
  },
});
app.component("plan-entry", PlanEntry);
app.component("day-selector", DaySelector);
app.use(router);
app.mount("#app");
