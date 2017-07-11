const call = (method, url, data, callback) => {
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      const status = request.status;

      if (status >= 200 && status <= 299) {
        const response = request.response;

        if (callback) {
          callback(response ? JSON.parse(request.response) : null);
        }
      }
      else {
        console.error('AJAX Error:', status, request.responseText);
      }
    }
  };

  request.open(method, url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(data ? JSON.stringify(data) : null);
};

window.ajax = {};

ajax.get = (url, callback) => {
  call('GET', url, null, callback);
};

ajax.put = (url, data, callback) => {
  call('PUT', url, data, callback);
};

ajax.post = (url, data, callback) => {
  call('POST', url, data, callback);
};

ajax.delete = (url, callback) => {
  call('DELETE', url, null, callback);
};
