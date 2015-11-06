GAME.particles = (function () {
    'use strict';

    var count,
        particles;

    // Creates a new particle
    function createParticle(spec) {
        var particle = {
                image: spec.image,
                size: spec.size,
                center: {
                    x: spec.x,
                    y: spec.y
                },
                speed: Random.getRandomInteger(10),
                rotation: Random.getRandomInteger(360),
                deltaX: Random.getRandomDoubleInRange(spec.dx.min, spec.dx.max),
                deltaY: Random.getRandomDoubleInRange(spec.dy.min, spec.dy.max),
                timeLeft: Random.getRandomDouble(spec.duration),
                expired: false
            };

        particles[count] = particle; // Adds particle to stored particles
        count++;
    }

    // Updates position and time remaining for each particle
    function update(elapsedTime) {
        var i, expired = [], p, cont = false;

        for (i = 0; i < particles.length; i++) {
            if (particles.hasOwnProperty(i)) {
                cont = true; // Means that there are still particles appearing
                p = particles[i];
                p.timeLeft -= elapsedTime;
                if (p.timeLeft <= 0) {
                    expired.push(i);
                } else {
                    p.center.x += elapsedTime * p.deltaX * p.speed;
                    p.center.y += elapsedTime * p.deltaY * p.speed;

                    p.rotation += p.speed / 100;
                }
            }
        }

        for (i = 0; i < expired.length; i++) {
            delete particles[expired[i]];
        }

        if(cont === false){
            reset();
        }

        return cont; // Returns whether or not particles have all expired (used in order to end animations)
    }

    // Renders particles
    function render() {
        var i;
        for (i = 0; i < particles.length; i++) {
            if (particles.hasOwnProperty(i)) {
                GAME.graphics.drawComponent(particles[i]);
            }
        }
    }

    // Resets the particle system
    function reset() {
        count = 0;
        particles = [];
    }

    return {
        createParticle: createParticle,
        update: update,
        render: render,
        reset: reset
    };
}());
