export default class cHeader {

  constructor() {
    this.Critical = 0;
    this.Urgent = 0;
    this.Completed = 0;
    this.Piped = 0;
  }

  addCritical() {
    this.Critical += 1;
  }

  addUrgent() {
    this.Urgent += 1;
  }

  addCompleted() {
    this.Completed += 1;
  }

  addPiped() {
    this.Piped += 1;
  }

  toJSON() {
    const headObject = {
      Critical: this.Critical,
      Urgent: this.Urgent,
      Completed: this.Completed,
      Piped: this.Piped
    };

    return JSON.stringify(headObject);
  }
}
