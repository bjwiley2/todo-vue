const userId = 1;
const apiUrl = `https://todo.timleland.com/api/user/${userId}/task/`;

var taskFormComponent = {
  props: {
    task: {
      type: Object,
      required: true
    },
  },
  data: function () {
    return {
      formTask: Object.assign({}, this.task)
    };
  },
  methods: {
    saveTask: function () {
      var self = this;
      ajax.put(apiUrl + self.formTask.id, self.formTask, function () {
        self.$emit('cancel');
        Object.assign(self.task, self.formTask);
      });
    },
    cancelEdit: function () {
      this.$emit('cancel');
    }
  },
  template: '#task-form-template'
};

window.vm = new Vue({
  el: '#app',
  components: {
    taskForm: taskFormComponent
  },
  data: {
    tasks: [],
    editingTask: null
  },
  methods: {
    editTask: function (task) {
      this.editingTask = task;
    },
    cancelEdit: function () {
      this.editingTask = null;
    }
  },
  mounted: function () {
    var self = this;

    ajax.get(apiUrl, function (tasks) {
      self.tasks = tasks;
    });
  }
});
