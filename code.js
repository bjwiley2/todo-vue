const userId = 1;
const apiUrl = `https://todo.timleland.com/api/user/${userId}/task/`;

window.vm = new Vue({
  el: '#app',
  data: {
    tasks: []
  },
  mounted () {
    const self = this;

    ajax.get(apiUrl, (tasks) => {
      self.tasks = tasks;
    });
  }
});
