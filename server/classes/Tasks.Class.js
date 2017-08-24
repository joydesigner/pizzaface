export default class Task {
  constructor(Name, Desc, URL, DueDate) {
    this.Name = Name;
    this.Desc = Desc;
    this.URL = URL;
    this.DueDate = DueDate;
  }

  addAssigned(Name) {
    this.Assigned.push(Name);
  }

  toJSON() {
    const taskObject = {
      Name: this.Name,
      Desc: this.Desk,
      URL: this.URL,
      DueDate: this.DueDate,
      Assigned: this.Assigned
    };

    return JSON.stringify(taskObject);
  }
}
