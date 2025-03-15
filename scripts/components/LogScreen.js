
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


import { Log } from '../data/Log.js'


export const LogScreen = {
    setup(props, context) {

    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, this.onAuthStateChanged);
    },
    methods: {
        onAuthStateChanged(user) {
            if (user) {
                this.currentUser = user;
                this.loadLogs();
            } else {
                this.currentUser = null;
                this.$router.replace({ path: "/" });
            }
        },
        loadLogs() {
            const db = getDatabase()
            const logsRef = ref(db, `/Users/${this.currentUser.uid}/logs`)
            onValue(logsRef, this.onLogUpdate);
        },
        onLogUpdate(snapshot) {
            const logs = Object.values(snapshot.val());
            this.logs = [];

            for (let i = logs.length - 1; i >= 0; i--) {
                const log = logs[i];
                this.logs.push(new Log(log.Data, log.Ts))
            }
        },
        dateToDisplay(ts) {
            const d = new Date(ts);

            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');

            const hour = d.getHours().toString().padStart(2, '0');
            const min = d.getMinutes().toString().padStart(2, '0');
            const sec = d.getSeconds().toString().padStart(2, '0');


            return `[<span class="year">${year}/${month}/${day}</span> <span class="time">${hour}:${min}:${sec}</span>]`
        }

    },
    data() {
        return {
            currentUser: null,
            logs: [],
        }
    },
    template: `
    <div>
        <mynav></mynav>
        <h1> Logs </h1>
        <table class="log-container">
            <tr>
                <th>Time</th>
                <th>Message</th>
            </tr>
            <tr v-for="log of logs" class="log-line">
                <td class="log-timestamp" v-html="dateToDisplay(log.timestamp)">
                </td>
                <td class="log-data">
                    {{log.data}}
                </td>
            </tr>
        </table>
    </div>
    `

}