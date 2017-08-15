const userId = 1;
const apiUrl = `https://todo.timleland.com/api/user/${userId}/task/`;

const call = (method, data, callback) => {
    const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            const status = request.status;

            if (status >= 200 && status <= 299) {
                const response = request.response;

                if (callback) {
                    callback(response ? JSON.parse(request.response) : null);
                }
            } else {
                console.error('AJAX Error:', status, request.responseText);
            }
        }
    };

    request.open(method, apiUrl, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(data ? JSON.stringify(data) : null);
};

window.ajax = {};

ajax.get = (callback) => {
    debugger
    call('GET', null, callback);
};

ajax.put = (data, callback) => {
    call('PUT', data, callback);
};

ajax.post = (data, callback) => {
    call('POST', data, callback);
};

ajax.delete = (callback) => {
    call('DELETE', null, callback);
};
