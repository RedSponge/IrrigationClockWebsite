export class Plan {
  constructor(
    name,
    days,
    duration,
    isEnabled,
    repeats,
    timestamp,
    startTime,
    valve
  ) {
    this.name = name;
    this.days = days;
    this.duration = duration;
    this.isEnabled = isEnabled;
    this.repeats = repeats;
    this.timestamp = timestamp;
    this.startTime = startTime;
    this.valve = valve;
  }

  toFirebase() {
    return {
      name: this.name,
      days: this.days,
      duration: this.duration,
      is_enabled: this.isEnabled,
      repeats: this.repeats,
      set_timestamp: this.timestamp,
      start_time: this.startTime,
      valve: this.valve,
    };
  }

  static default(name) {
    return new Plan(name, 0, 600, true, 0, Date.now(), 12 * 60 * 60, 1);
  }
}
