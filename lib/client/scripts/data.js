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

        var friendPane = document.getElementById('friendPane');

        if (!friendPane) {
            return console.log('friendPane element not found');
        }

        for (var f = 0; f < user.friends.length; f++) {

            var friendEl = friendPane.appendChild(document.createElement('span'));
            friendEl.textContent = user.friends[f].username || user.friends[f].email;

            var viewButton = friendEl.appendChild(document.createElement('button'));
            viewButton.type = 'button';
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

            var recipient = user.friends[f].id;
            var sendButton = friendEl.appendChild(document.createElement('button'));
            sendButton.type = 'button';
            sendButton.textContent = 'Send';
            sendButton.setAttribute('data-recipient', recipient);
            sendButton.addEventListener('click', function (event) {
                GAME.camera.send.call(this);
                window.alert('successfully sent snapchallenge to ' + recipient);                
            });

        }

        var requestPane = document.getElementById('requestPane');

        if (!requestPane) {
            return console.log('requestPane element not found');
        }

        for (var r = 0; r < user.requests.length; r++) {

            var requestEl = requestPane.appendChild(document.createElement('span'));
            requestEl.textContent = user.requests[r].sender.username || user.requests[r].sender.email;
            requestEl.setAttribute('data-id', user.requests[r].id);

            var acceptButton = requestEl.appendChild(document.createElement('button'));
            acceptButton.type = 'button';
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

        var sendRequestInput = requestPane.appendChild(document.createElement('input'));
        sendRequestInput.type = 'text';
        sendRequestInput.id = 'friend-request';
        sendRequestInput.setAttribute('placeholder', 'Add New Friend');

        var sendRequestSubmit = requestPane.appendChild(document.createElement('input'));
        sendRequestSubmit.type = 'submit';
        sendRequestSubmit.value = 'Send Request';
        sendRequestSubmit.className = 'btn';
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
