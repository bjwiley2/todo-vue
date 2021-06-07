Vue.component('hover-card', {
    mounted: function () {
        $(this.$el).hoverCard();
    },
    template: '<div class="hover-card"><a tabindex="-1" href="javascript:void(0);"></a><div class="hover-detail slide-right bottom-positioned"><slot></slot></div></div>'
});

Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
});

Vue.filter('truncate', function (str, length) {
    length = length || 20;

    if (str.length <= length) {
        return str;
    }

    str = str.slice(0, length);

    return str + '...';
});

Vue.filter('formatDate', function (date) {
    date = new Date(date);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
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
            //{} (an empty object - it's the same as new Object()
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

window.vm = new Vue({
    el: '#app',
    components: {
        taskForm: taskFormComponent
    },
    data: function () {
        return {
            heading: 'To Do List',
            tasks: [],
            taskModel: {},
            searchValue: null,
            taskLoaded: true
        }
    },
    created: function () {
        this.getTasks();
    },
    methods: {
        getTasks: function () {
            var self = this;
            api.getList(function (tasks) {
                self.taskLoaded = true;
                self.tasks = tasks;
            });
        },
        addTask: function (task) {
            var self = this;
            self.taskLoaded = false;
            api.create(task, function (id) {
                api.get(id, function (task) {
                    self.tasks.push(task);
                    self.taskLoaded = true;
                })
            });
        },
        deleteTask: function (index) {
            var self = this;
            var task = self.tasks[index];
            api.delete(task.id, function () {
                self.tasks.splice(index, 1);
            });
        },
        editTask: function (task) {
            var self = this;
            self.taskModel = task;
        },
        saveTask: function (task) {
            var self = this;
            api.update(task, function () {
                var index = self.tasks.findIndex(i => i.id === task.id);
                self.tasks[index] = task;
                self.taskModel = {};
            });
        },
        completeTask: function (task) {
            var self = this;
            task.completed = !task.completed;
            api.update(task, function () { });
        }
    },
    computed: {
        filteredTasks: function () {
            var self = this;
            //searching a task from input form
            if (!self.searchValue) {
                return self.tasks;
            }
            return self.tasks.filter(function (value) {
                return value.task.toLowerCase().includes(self.searchValue.toLowerCase());
            });
        }
    }
});




