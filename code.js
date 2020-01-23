// Register a global custom directive called `v-focus`
Vue.directive('focus', {
    // When the bound element is inserted into the DOM...
    inserted: function (el) {
        // Focus the element
        el.focus()
    }
})


window.vm = new Vue({
    el: '#app',
    data: function() {
        return {
            heading: 'To Do List',
            tasks: [],
            newTask: null
        };
    },
    //lifecycle hook to call a method to get a list of tasks
    created: function() {
        this.getTasks();
    },
    methods: {
        // method to get a list of tasks
        getTasks: function() {
            var self = this;
            api.getList(function(tasks) {
                self.tasks = tasks;
            });
        },
        // method to add a Task to the list
        addTask: function() {
            var self = this;
            var task = {
                task: self.newTask
            };
            //create a task, and clear the input
            api.create(task,
                function(id) {
                    api.get(id,
                        function(task) {
                            self.tasks.push(task);
                            self.newTask = null;
                        });
                });
        },
        // method to delete a Task from the list
         deleteTask: function() {
            var self = this;
            var task = this.task;
            api.delete(task,
                function (id) {
                    api.delete(id,
                        function (task) {
                            delete(tasks.task);
                        });
                });
        }
    }
});