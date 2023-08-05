var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DaySelector = {
  props: {
    days: Number,
  },
  emits: ["input"],
  methods: {
    getState(idx) {
      // idx:  1 = Sunday, 7 = Saturday
      // In bitfield, MSB = Sunday
      const bit = 8 - idx;

      return ((this.days >> bit) & 1) == 1;
    },
    updateState(event, idx) {
      const bit = 8 - idx;
      if (event.target.checked) {
        const newDays = this.days | (1 << bit);
        this.$emit("input", newDays);
      } else {
        const newDays = this.days & ~(1 << bit);
        this.$emit("input", newDays);
      }
    },
    getDayName(idx) {
      return days[idx - 1];
    },
  },
  template: `
  <div class="day-selector-container">
    <div class="day-selector-day" v-for="i in 7" :key="i">
        <div>{{getDayName(i)}}</div>
        <input :checked="getState(i)" @input="(event) => updateState(event, i)" type="checkbox"/>
    </div>
  </div>
    `,
};
