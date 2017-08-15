window.vm = new Vue({
  el: '#app',
  data: {
    tasks: []
  },
  mounted () {
    const self = this;

    api.getList((tasks) => {
      self.tasks = tasks;
    });
  }
});
