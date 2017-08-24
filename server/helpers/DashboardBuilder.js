/* eslint-disable max-len */
import { Dashboard } from '../classes/Dashboard.Class';
import { Header } from '../classes/Header.Class';
import { Project } from '../classes/Projects.Class';
import { Task } from '../classes/Tasks.Class';

import { UserModel } from '../models/user.model.js';
import { ProjectModel } from '../models/project.model.js';
import { TaskModel } from '../models/task.model';

function BuildDashboard(email) {
  const dashboard = new Dashboard();
  const header = new Header();
  const user = getUser(email);
  const tasks = getTasks(user);
  buildHeader(tasks, header);
  dashboard.addHeader(header);
  const projects = getProjects(tasks);

  projects.forEach((project) => {
    dashboard.addProject(project);
  });

  return dashboard.toJSON();
}

function buildHeader(tasks, header) {
  tasks.forEach((task) => {
    const urgency = task.MetaData.Urgence;
    switch (urgency) {
      case (0):
        header.addCompleted();
        break;
      case (1):
        header.addCritical();
        break;
      case (2):
        header.addUrgent();
        break;
      case (3):
        header.addPiped();
        break;
      default:
        break;
    }
  });
}

function getUser(email) {
  UserModel.findone({ Email: email }, (err, user) => {
    if (err) {
      console.log(err);
    }
    return user;
  });
}

function getTasks(user) {
  const Tasks = [];
  user.Assigned.forEach((taskId) => {
    TaskModel.findone({ id: taskId }, (err, task) => {
      if (err) console.log(err);
      Tasks.push(task);
    });
    return Tasks;
  });
}

function getProjects(tasks) {
  const projects = [];

  tasks.forEach((task) => {
    if (!projects[task.Project]) {
      const mProjcet = Project.findById(task.Project);
      projects[task.Project] = new Project(ProjectModel.ProjectName, ProjectModel.Owner, mProjcet.Duedate);
    }
    const taskObj = new Task(task.TaskName, task.Desc, task.URL, task.Duedate);
    addAssignedToTask(taskObj, task);
    projects[task.Project].addTask(taskObj);
  });
}

function addAssignedToTask(taskObj, task) {
  task.Assigned.forEach((taskId) => {
    taskObj.addAssigned(UserModel.findById(taskId).Name);
  });
}

export default { BuildDashboard };
