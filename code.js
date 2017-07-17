const userId = 1;
const apiUrl = `https://todo.timleland.com/api/user/${userId}/task/`;

ajax.get(apiUrl, (tasks) => {
  console.log(tasks);
});

window.vm = new Vue({
  el: "#app",
  data: {
    tasks: [
      { task: "Get these tasks from the API" }
    ]
  }
});
