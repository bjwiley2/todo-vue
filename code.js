Vue.component('datePicker', {
    props: {
      value: [String, Date]
    },
    methods: {
      formatValueForPlugin: function (date) {
        if (date === null) {
          return null;
        }

        date = new Date(date);
        return date.toLocaleDateString();
      },
      handleChange: function (value) {
        var self = this;
        self.$emit('input', value);
        self.$emit('change', value);
      },
      setValue: function () {
        var self = this;
        var formattedValue = self.formatValueForPlugin(this.value);
        $(self.$el).datePicker('setValue', formattedValue);
      }
    },
    watch: {
      value: function () {
        var self = this;
        self.setValue();
      }
    },
    mounted: function () {
      var self = this;
      var el = $(self.$el);
      el.data('changeCallback', self.handleChange);
      el.datePicker();
      self.setValue();
    },
    template: '<input type="text" />'
});

Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
});

Vue.filter('truncate', function (value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return value.substring(0, maxLength) + '...';
});

var taskFormComponent = {
  props: {
    task: {
      type: Object,
      default: null
    }
  },
  data: function () {
    var self = this;

    return {
      taskText: self.task ? self.task.task : '',
      dateAdded: self.task ? self.task.dateAdded : new Date()
    };
  },
  computed: {
    isAdd: function () {
      var self = this;
      return self.task === null;
    },
    placeholder: function () {
      var self = this;
      return self.isAdd ? 'Add a task' : 'Edit this task';
    }
  },
  methods: {
    handleSubmit: function () {
      var self = this;
      self.$emit('submit', {
        task: self.taskText,
        dateAdded: self.dateAdded,
        completed: self.task ? self.task.completed : false
      });

      if (self.isAdd) {
        self.taskText = '';
        self.dateAdded = new Date();
      }
    }
  },
  template: '#task-form-template'
};

window.vm = new Vue({
    el: '#app',
    components: {
      taskForm: taskFormComponent
    },
    data: function() {
        return {
            heading: 'To Do List',
            tasks: [],
            editingTask: null,
            searchText: ''
        };
    },
    created: function() {
      var self = this;

      api.getList(function (items) {
        self.tasks = items;
      });
    },
    computed: {
      filteredTasks: function () {
        var self = this;
        var term = this.searchText.trim();

        if (term.length === 0) {
          return self.tasks;
        }

        return self.tasks.filter(function (t) {
          return t.task.indexOf(term) !== -1;
        });
      }
    },
    methods: {
      addNewTask: function (task) {
        var self = this;

        api.create(task, function (newId) {
          task.id = newId;
          self.tasks.push(task);
          self.newTaskText = '';
        });
      },
      deleteTask: function (task, index) {
        var self = this;

        api.delete(task.id, function () {
          self.tasks.splice(index, 1);
        });
      },
      setEditingTask: function (task) {
        var self = this;
        self.editingTask = task;
        self.editTaskText = task.task;
      },
      editTask: function (task) {
        var self = this;
        self.editingTask.task = task.task;
        self.editingTask.dateAdded = task.dateAdded;

        api.update(self.editingTask, function () {
          self.editingTask = null;
        });
      }
    }
});
