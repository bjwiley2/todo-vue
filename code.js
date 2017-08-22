Vue.component('hover-card', {
    mounted: function() {
        $(this.$el).hoverCard();
    },
    template: '<div class="hover-card"><a tabindex="-1" href="javascript:void(0);"><i class="fa fa-info-circle" aria-hidden="true"></i></a><div class="hover-detail slide-right bottom-positioned"><slot></slot></div></div>'
});

Vue.directive('focus', {
    inserted: function(el) {
        el.focus()
    }
});

Vue.filter('truncate', function(str, length) {
    length = length || 30;

    if (str.length <= length) {
        return str;
    }

    str = str.slice(0, length);

    return str + '...';
});

Vue.filter('formatDate', function(date) {
    date = new Date(date);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
});

var taskFormComponent = {
  props: {
    task: {
      type: Object,
      default: null
    }
  },
  data: function () {
    return {
      formTask: {}
    };
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    reset: function () {
      var source = this.task || {};

      this.formTask = {
        id: source.id,
        task: source.task,
        completed: !!source.completed,
        dateAdded: source.dateAdded || new Date()
      };
    },
    handleSubmit: function () {
      this.$emit('submit', this.formTask);
      this.reset();
    }
  },
  computed: {
    isAddForm: function () {
      return !this.task;
    }
  },
  template: '#task-form-template'
};

var taskItemComponent = {
  components: {
    taskForm: taskFormComponent
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    isEditing: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    deleteTask: function () {
      this.$emit('delete-task', this.task);
    },
    saveTask: function (formTask) {
        var self = this;
        self.task.task = formTask.task;
        api.update(self.task, function () {});
        this.$emit('quit-editing');
    },
    completeTask: function () {
        var self = this;
        this.task.completed = !this.task.completed;
        api.update(self.task, function () {});
    },
    editTask: function () {
        var self = this;
        self.$emit('edit-task', self.task);
    },
  },
  template: '#task-item-template'
};

window.vm = new Vue({
    el: '#app',
    components: {
      taskForm: taskFormComponent,
      taskItem: taskItemComponent
    },
    data: function() {
        return {
            heading: 'To Do List',
            tasks: [],
            taskModel: {},
            searchValue: null,
            taskLoaded: false
        }
    },
    created: function() {
        this.getTasks();
    },
    methods: {
        getTasks: function() {
            var self = this;
            api.getList(function(tasks) {
                self.taskLoaded = true;
                self.tasks = tasks;
            });
        },
        addTask: function (task) {
            var self = this;

            api.create(task, function(id) {
                api.get(id, function(task) {
                    self.tasks.push(task);
                })
            });
        },
        deleteTask: function (task) {
            var self = this;
            var index = self.tasks.indexOf(task);
            api.delete(task.id, function() {
                self.tasks.splice(index, 1);
            });
        },
        editTask: function (task) {
            var self = this;
            self.taskModel = task;
        },
        quitEditing: function () {
            var self = this;
            self.taskModel = {};
        }
    },
    computed: {
        filteredTasks: function() {
            var self = this

            if (!self.searchValue) {
                return self.tasks;
            }

            return self.tasks.filter(function(value) {
                return value.task.toLowerCase().includes(self.searchValue.toLowerCase());
            });
        }
    }
});
