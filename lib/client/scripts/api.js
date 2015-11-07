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

        return _fetch('/getFriendsAndMore', {
            method: 'get'
        });

    };

    exports.deleteSnap = function getSnap (snapId) {

        return _fetch('/deleteSnap/' + encodeURIComponent(snapId), {
            method: 'delete'
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

    exports.createRequest = function createRequest (searchItem) {

        return _fetch('/request', {
            body: {
                searchItem: searchItem
            }
        });

    };

    exports.acceptRequest = function addFriend (requestId) {

        return _fetch('/request/' + encodeURIComponent(requestId), {
            method: 'get'
        });

    };

    exports.declineRequest = function declineRequest (requestId) {

            return _fetch('/request/' + encodeURIComponent(requestId), {
                method: 'delete'
            });

    };

    return exports;

}());