const userId = 1;
const apiUrl = `https://todo.timleland.com/api/user/${userId}/task/`;

var taskSelectComponent = {
  props: {
    value: {
      type: Object,
      default: null
    },
    list: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      internalValue: this.value
    };
  },
  watch: {
    internalValue: function () {
      this.$emit('input', this.internalValue);
      this.$emit('change', this.internalValue);
    },
    value: function () {
      this.internalValue = this.value;
    }
  },
  template: '#task-select-template'
};

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
  watch: {
    task: function () {
      Object.assign(this.formTask, this.task);
    }
  },
  template: '#task-form-template'
};

window.vm = new Vue({
  el: '#app',
  components: {
    taskForm: taskFormComponent,
    taskSelect: taskSelectComponent
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
