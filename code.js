window.vm = new Vue({
    el: '#app',
    data: function() {
        return {
            tasks: []
        }
    },
    created: function() {
        this.getTasks();
    },
    methods: {
        getTasks: function() {
            var self = this;
            ajax.get(function(tasks) {
                self.tasks = tasks;
            });
        }
    }
});
