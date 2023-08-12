import {
  getDatabase,
  set,
  get,
  remove,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import { Plan } from "../data/Plan.js";

export const PlanScreen = {
  setup(props, context) {
    // this.ref = ref();
    // this.loadPlans();
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, this.onAuthStateChanged);
  },
  methods: {
    loadPlans() {
      const db = getDatabase();
      const plansRef = ref(db, `/Users/${this.currentUser.uid}/Plans`);
      onValue(plansRef, this.onPlanUpdate);
      console.log(plansRef);
    },
    onAuthStateChanged(user) {
      if (user) {
        this.currentUser = user;
        this.loadPlans();
      } else {
        this.currentUser = null;
        this.$router.replace({ path: "/" });
      }
    },
    onPlanUpdate(snapshot) {
      const plans = Object.values(snapshot.val());
      this.plans = [];

      for (let plan of plans) {
        this.plans.push(
          new Plan(
            plan.name,
            plan.days,
            plan.duration,
            plan.is_enabled,
            plan.repeats,
            plan.set_timestamp,
            plan.start_time,
            plan.valve
          )
        );
      }
    },
    updateFirebase(plan, field) {
      const db = getDatabase();
      const planRef = ref(
        db,
        `/Users/${this.currentUser.uid}/Plans/${plan.name}/${field}`
      );
      const toFB = plan.toFirebase();
      set(planRef, toFB[field]);
    },
    logout() {
      const auth = getAuth();
      signOut(auth);
    },
    deletePlan(plan) {
      const db = getDatabase();
      const plansRef = ref(
        db,
        `/Users/${this.currentUser.uid}/Plans/${plan.name}`
      );
      remove(plansRef);
    },
    addPlan() {
      const planName = prompt("What's the new plan's name?");
      for (let plan of this.plans) {
        if (plan.name == planName) {
          alert("Name is already taken!");
          return;
        }
      }
      const db = getDatabase();
      const planRef = ref(
        db,
        `/Users/${this.currentUser.uid}/Plans/${planName}`
      );
      set(planRef, Plan.default(planName).toFirebase());
    },
  },
  data() {
    return {
      currentUser: null,
      plans: [],
    };
  },
  template: `
    <div>    
    <h1> Plans </h1>
    <table class="plan-board">
        <tr v-for="plan of plans" :key="plan.name">
            <plan-entry @deleted="deletePlan(plan)" @changed="(event) => updateFirebase(plan, event.field)" :plan="plan"/>
        </tr>
    </table>
    <button @click="addPlan">Add Plan</button>
    <button @click="logout">Log Out</button>
    </div>
  `,
};
