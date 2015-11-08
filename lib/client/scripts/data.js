(function () {

    GAME.api.getFriendsAndMore().then(function (user) {

        if (user.error) {
            return console.log(user);
        }

        var username = document.querySelector('li#username > a');

        if (!username) {
            console.log('username element not found');
        }

        username.textContent = user.username || user.email;

        var friendList = document.getElementById('friendList');

        if (!friendList) {
            return console.log('friendList element not found');
        }

        for (var f = 0; f < user.friends.length; f++) {

            var friendEl = friendList.appendChild(document.createElement('li'));
            friendEl.textContent = user.friends[f].username || user.friends[f].email;
            friendEl.className = 'friend';

            var viewButton = friendEl.appendChild(document.createElement('button'));
            viewButton.type = 'button';
            viewButton.className = 'btn btn-default';
            viewButton.textContent = 'View';

            if (user.friends[f].snap) {
                viewButton.setAttribute('data-image', user.friends[f].snap.image);
                viewButton.setAttribute('data-duration', user.friends[f].snap.duration);
                viewButton.setAttribute('data-id', user.friends[f].snap.id);
                viewButton.addEventListener('click', function (event) {
                    this.disabled = true;
                    GAME.camera.load.call(this);
                    GAME.api.deleteSnap(this.getAttribute('data-id')).then(function (res) {
                        if (res.error) {
                            console.log(res.message);
                        }
                    });
                });
            } else {
                viewButton.disabled = true;
            }

            var sendButton = friendEl.appendChild(document.createElement('button'));
            sendButton.type = 'button';
            sendButton.className = 'btn btn-info';
            sendButton.textContent = 'Send';
            sendButton.setAttribute('data-recipient-name', user.friends[f].username || user.friends[f].email);
            sendButton.setAttribute('data-recipient', user.friends[f].id);
            sendButton.addEventListener('click', function (event) {
                GAME.camera.send.call(this);
                window.alert('successfully sent snapchallenge to ' + this.getAttribute('data-recipient-name'));
            });
        }

        var requestList = document.getElementById('requestList');

        if (!requestList) {
            return console.log('requestList element not found');
        }

        for (var r = 0; r < user.requests.length; r++) {

            var requestEl = requestList.appendChild(document.createElement('li'));
            requestEl.textContent = user.requests[r].sender.username || user.requests[r].sender.email;
            requestEl.setAttribute('data-id', user.requests[r].id);
            requestEl.className = 'friend';

            var acceptButton = requestEl.appendChild(document.createElement('button'));
            acceptButton.type = 'button';
            acceptButton.className = 'btn btn-primary';
            acceptButton.textContent = 'Accept';
            acceptButton.addEventListener('click', function clickAcceptButton (event) {
                var requestId = this.parentElement.getAttribute('data-id');
                GAME.api.acceptRequest(requestId).then(function (res) {
                    console.log('/acceptRequest response:', res.status);
                });
                acceptButton.removeEventListener(clickAcceptButton);
                requestEl.parentElement.removeChild(requestEl);
            });

            var declineButton = requestEl.appendChild(document.createElement('button'));
            declineButton.type = 'button';
            declineButton.className = 'btn btn-danger';
            declineButton.textContent = 'Decline';
            declineButton.addEventListener('click', function clickDeclineButton (event) {
                var requestId = this.parentElement.getAttribute('data-id');
                GAME.api.declineRequest(requestId).then(function (res) {
                    console.log('/deleteRequest response:', res.status);
                });
                declineButton.removeEventListener(clickDeclineButton);
                requestEl.parentElement.removeChild(requestEl);
            });

        }
        var requestPane = document.getElementById('requestPane');
        var sendRequestInput = document.getElementById('friend-request-field');
        sendRequestInput.setAttribute('placeholder', 'Add New Friend');

        var sendRequestSubmit = document.getElementById('friend-request-submit')
        sendRequestSubmit.addEventListener('click', function sendRequestClicked (event) {

            if (!sendRequestInput.value) return;

            GAME.api.createRequest(sendRequestInput.value).then(function (res) {

                if (res.status === 204) {
                    window.alert('Successfully sent friend request to ' + sendRequestInput.value);
                } else if (res.error) {
                    window.alert(res.message);
                }

                sendRequestInput.value = '';

            });

        });

    }).catch(function (error) {
        console.log(error);
    });

}());
