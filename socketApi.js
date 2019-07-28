window.onload = function() {
    var socket = io();

    var mesForm = document.getElementById('sendMessage');
    var logForm = document.getElementById('enterLogin');
    logForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var input = document.getElementById('userLogin');
        socket.emit('new user', input.value);
        socket.on('new user', function (answer) {
            if(answer) {
                input.classList.remove('is-invalid');
                document.getElementById('login').classList.add('d-none');
                document.getElementById('chat').classList.remove('d-none');
                document.location.hash = '#chat'
            } else {
                input.classList.add('is-invalid')
            }

        })
    }, false);

    mesForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var input = document.getElementById('m');
        socket.emit('new message', input.value);
        input.value = '';
    }, false);

    socket.on('new message', function (arr) {
        var row = document.createElement('div');
        var subrow = document.createElement('div');
        row.className = 'row';
        subrow.className = 'col-12';
        var mainDiv = document.getElementById('messages');
        var divOuter = document.createElement('div');
        if (socket.id !== arr[1]) {
            divOuter.className = "card bg-light mt-2 float-left";
        } else {
            divOuter.className = "card border-secondary mt-2 float-right";
        }
        divOuter.style = 'width: 35rem;';
        var divBody = document.createElement('div');
        divBody.className = 'card-body';
        var divTitle = document.createElement('h5');
        divTitle.setAttribute('name', arr[1]);
        divTitle.className = 'card-header';
        divTitle.textContent = arr[2][arr[1]];
        var online = document.createElement('span');
        online.className = 'badge badge-success float-right';
        online.textContent = 'Онлайн';
        var divText = document.createElement('p');
        divText.className = 'card-text';
        divText.textContent = arr[0];
        divTitle.appendChild(online);
        divBody.appendChild(divText);
        divOuter.appendChild(divTitle);
        divOuter.appendChild(divBody);
        subrow.appendChild(divOuter);
        row.appendChild(subrow);
        mainDiv.appendChild(row);
    });

    socket.on('disconnect', function (id) {
        if(socket.id === undefined) {
            document.getElementById('login').classList.remove('d-none');
            document.getElementById('chat').classList.add('d-none');
            document.location.hash = '#login'
        }
        var messageList = document.getElementsByName(""+id);
        for( var i = 0; i < messageList.length; i++ ) {
            messageList[i].innerHTML =
                messageList[i].innerText.slice(0, messageList[i].innerText.length - 6) +
                '<span class="badge badge-danger float-right">Офлайн</span>';
        }

    });

    socket.on('old user', function (id) {
        document.getElementById('login').classList.add('d-none');
        document.getElementById('chat').classList.remove('d-none');

        var messageList = document.getElementsByName(""+id);
        for(var i = 0; i < messageList.length; i++) {
            messageList[i].innerHTML =
                messageList[i].innerText.slice(0, messageList[i].innerText.length-6) +
                '<span class="badge badge-success float-right">Онлайн</span>';

        }
    });

    socket.on('user info', function (info) {
        var list = document.getElementById('userStatus');
        list.innerHTML='';
        for (user in info[0]) {
            var ul = document.createElement('ul');
            ul.className = 'list-group';
            ul.style = 'width: 21rem;';
            var li = document.createElement('li');
            li.className = 'list-group-item';
            var h5 = document.createElement('h5');
            h5.name = info[1][user];
            if ( info[0][user] ) {
                h5.innerHTML = user + '<span class="badge badge-success float-right">Онлайн</span>';
            } else {
                h5.innerHTML = user + '<span class="badge badge-danger float-right">Офлайн</span>';
            }
            li.appendChild(h5);
            ul.appendChild(li)
            list.appendChild(ul)
        }
    })
};

