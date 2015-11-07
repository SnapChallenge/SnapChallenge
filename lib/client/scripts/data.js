(function () {

    GAME.api.getFriendsAndMore().then(function (user) {

        var friendPane = document.getElementById('friendPane');

        if (!friendPane) {
            return console.log('friendPane element not found');
        }

        for (var f = 0; f < user.friends.length; f++) {

            var span = friendPane.appendChild(document.createElement('span'));
            span.textContent = user.friends[f].username || user.friends[f].email;

            var viewButton = span.appendChild(document.createElement('button'));
            viewButton.type = 'button';
            viewButton.textContent = 'View';

            if (user.friends[f].snap) {
                viewButton.setAttribute('data-image', user.friends[f].snap.image);
                viewButton.setAttribute('data-duration', user.friends[f].snap.duration);
                viewButton.addEventListener(GAME.camera.load);
            } else {
                viewButton.disabled = true;
            }

            var sendButton = span.appendChild(document.createElement('button'));
            sendButton.type = 'button';
            sendButton.textContent = 'Send';
            sendButton.setAttribute('data-recipient', user.friends[f].id);
            sendButton.addEventListener(GAME.camera.send);

        }

    }).catch(function (error) {
        console.log(error);
    });

}());