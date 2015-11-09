!(function () {

    function fn () {

        var signupForm = document.querySelector('form[name="signup"]');

        var submit = signupForm.querySelector('input[type="submit"]');
        var pw1 = signupForm.querySelector('input[name="password"]');
        var pw2 = signupForm.querySelector('input[name="password_again"]');

        if (!submit || !pw1 || !pw2) {

            console.log('submit, password and/or password again element(s) not found');

        } else {

            signupForm.addEventListener('submit', function (event) {

                if (!pw1.value.trim() ||
                        pw1.value.trim() !== pw2.value.trim()) {
                    window.alert('Passwords do not match');
                    event.preventDefault();
                }

            });

        }

    }

    if (document.readyState === 'complete') {
        setTimeout(fn, 0);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }

}());
