import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

export const LoginScreen = {
  props: {
    firebase: Object,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    tryLogin() {
      console.log(this.firebase);
      const auth = getAuth();
      const router = this.$router;
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((user) => {
          router.replace({ path: "/plans" });
        })
        .catch((error) => {
          alert(`Failed to log in! Error: ${error}`);
        });
    },
  },
  template: `
    <div>
        Email: <input type="email" v-model="email"/>
        Password: <input type="password" v-model="password"/>
        <button @click="tryLogin">Login</button>
    </div>
    `,
};
