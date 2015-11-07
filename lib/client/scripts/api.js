GAME.api = (function () {

    var exports = {};
    var defaultOptions = {
        method:'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    function _fetch (url, options) {

        if (!options) options = {};

        for (var k in defaultOptions) {
            if (!options[k]) options[k] = defaultOptions[k];
        }

        if ('body' in options && typeof options.body !== 'string') {
            options.body = JSON.stringify(options.body);
        }

        return window.fetch(url, options).then(function (res) {

            if (res.status === 204) {
                return res;
            } else {
                return res.json();
            }

        }).catch(function (error) {
            console.log(error);
        });

    }

    exports.getFriendsAndMore = function getFriendsAndMore () {

        return _fetch('/getFriendsAndMore');

    };

    exports.getSnap = function getSnap (id) {

        return _fetch('/getSnap', {
            body: {id: id}
        });

    };

    exports.sendSnap = function sendSnap (image, recipient, duration) {

        return _fetch('/sendSnap', {
            body: {
                image: image,
                recipient: recipient,
                duration: duration
            }
        });

    };

    return exports;

}());