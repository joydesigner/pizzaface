export default class Dashboard {
  addHeader(Header) {
    this.Header = Header;
  }

  addProject(Project) {
    this.Projects.push(Project);
  }

  toJSON() {
    const dashboardObj = {
      Header: this.Header,
      Projects: this.Projects
    };
    const jsonString = JSON.stringify(dashboardObj);

    return jsonString;
  }
}
