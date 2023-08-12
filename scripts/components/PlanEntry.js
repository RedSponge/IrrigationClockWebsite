import { Plan } from "../data/Plan.js";

const secondsToInputTime = (seconds) => {
  const hour = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hour * 3600) / 60);
  const minuteSeconds = seconds - (hour * 60 + minutes) * 60;
  return `${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${minuteSeconds.toString().padStart(2, "0")}`;
};

const inputTimeToSeconds = (input) => {
  const [hour, minute, second] = input.split(":");
  return (parseInt(hour) * 60 + parseInt(minute)) * 60 + parseInt(second);
};

// Max seconds a plan is allowed to span: 24 hours - 1 second.
const MAX_TIME = 24 * 60 * 60 - 1;

export const PlanEntry = {
  props: {
    plan: Plan,
  },
  emits: ["changed", "deleted"],
  computed: {
    startTimeString() {
      return secondsToInputTime(this.plan.startTime);
    },
    endTimeString() {
      return secondsToInputTime(this.plan.startTime + this.plan.duration);
    },
  },
  methods: {
    startChanged(event) {
      this.plan.startTime = inputTimeToSeconds(this.$refs.startTime.value);
      this.publishUpdate("start_time");
      if (this.capDuration()) {
        this.publishUpdate("duration");
      }
    },
    endChanged(event) {
      let newEnd = inputTimeToSeconds(this.$refs.endTime.value);
      if (newEnd < this.plan.startTime) {
        console.log("newEnd is smaller than startTime!");
        newEnd = this.plan.startTime;
        this.$refs.endTime.value = secondsToInputTime(newEnd);
      }
      this.plan.duration = newEnd - this.plan.startTime;
      this.publishUpdate("duration");
    },
    capDuration() {
      if (this.plan.startTime + this.plan.duration > MAX_TIME) {
        // Cap to maximum time the plan can take.
        this.plan.duration = MAX_TIME - this.plan.startTime;
        return true;
      }
      return false;
    },
    daysChanged(days) {
      this.plan.days = days;
      this.publishUpdate("days");
    },
    valveChanged(event) {
      this.plan.valve = parseInt(event.target.value);
      this.publishUpdate("valve");
    },
    publishUpdate(field) {
      this.$emit("changed", { field: field });
    },
    isEnabledChanged(event) {
      this.plan.isEnabled = event.target.checked;
      this.publishUpdate("is_enabled");
    },
    deletePlan() {
      if (confirm(`Are you sure you wish to delete ${this.plan.name}`)) {
        this.$emit("deleted");
      }
    },
  },
  mounted() {
    console.log(this.plan);
  },
  template: `
    <div class="plan-entry-container">
        <div class="plan-entry-enabled">
            <input type="checkbox" @input="isEnabledChanged" :checked="plan.isEnabled"/>
        </div>
        <div class="plan-entry-name">{{plan.name}}</div>
        <div class="plan-entry-time">
            From <input @input="startChanged" ref="startTime" type="time" class="plan-entry-start-time" :value="startTimeString"/>
            to <input @input="endChanged" ref="endTime" type="time" class="plan-entry-end-time" :value="endTimeString"/>
        </div>
        <day-selector @input="daysChanged" :days="this.plan.days"/>
        <div class="plan-entry-valve">
            Valve: 
            <select @input="valveChanged" :value="plan.valve">
                <option value="0">1</option>
                <option value="1">2</option>
            </select>
        </div>
        <div>
            <button @click="deletePlan">Delete</button>
        </div>
    </div>
    `,
};
