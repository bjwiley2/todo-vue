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
            api.getList(function(tasks) {
                self.tasks = tasks;
            });
        }
    }
});
