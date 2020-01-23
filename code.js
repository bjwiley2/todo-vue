Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})


window.vm = new Vue({
    el: '#app',
    data: function () {
        return {
            heading: 'To Do List',
            tasks: [],
            newTask: null
        };
    },
    //lifecycle hook to call a method to get a list of tasks
    created: function () {
        this.getTasks();
    },
    methods: {
        // method to get a list of tasks
        getTasks: function () {
            var self = this;
            api.getList(function (tasks) {
                self.tasks = tasks;
            });
        },
       // method to add a Task to the list
        addTask: function () {
            var self = this;
            var task = {
                task: self.newTask
            };
            //create a task, and clear the input
            api.create(task, function (id) {
                api.get(id, function (task) {
                    self.tasks.push(task);
                    self.newTask = null;
                });
            });
        }
    }
});