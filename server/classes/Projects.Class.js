export default class Project {
  constructor(taskName, owner, closed, tasks) {
    this._taskName = taskName;
    this._owner = owner;
    this._closed = closed;
    this._tasks = tasks;
  }
  getTasks() {
    return this._tasks;
  }
  addTask(task) {
    this._tasks.push(task);
  }
  toJSON() {
    const projectObject = {
      TaskName: this._taskName,
      Owner: this._owner,
      Closed: this._closed,
      Tasks: this._tasks
    };
    return JSON.stringify(projectObject);
  }
}
