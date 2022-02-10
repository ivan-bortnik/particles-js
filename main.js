var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');

var frameRate = 60; // Render frequency
var updateRate = 60; // Particles update frequency

var particles = [] // Each particle is a dict

// Emission settings
var emissionRadius = 0;

var angle = 0;
var spread = 0.79;

var minSpeed = 0;
var maxSpeed = 10;

var gravity = {x: 0.0, y: 0.5}

var lifeSpan = 1;

// UI elements references
var radiusControl = document.querySelector('#radius-slider');
var angleControl = document.querySelector('#angle-slider');
var spreadControl = document.querySelector('#spread-slider');
var minSpeedControl = document.querySelector('#minspeed-slider');
var maxSpeedControl = document.querySelector('#maxspeed-slider');
var lifeSpanControl = document.querySelector('#lifespan-slider')
var gravityXControl = document.querySelector('#gravity-x-slider');
var gravityYControl = document.querySelector('#gravity-y-slider');


// Bind UI controls
radiusControl.oninput = function() {
    emissionRadius = parseFloat(this.value);
}

angleControl.oninput = function() {
    angle = parseFloat(this.value);
}

spreadControl.oninput = function() {
    spread = parseFloat(this.value);
}

minSpeedControl.oninput = function() {
    minSpeed = parseFloat(this.value);
}

maxSpeedControl.oninput = function() {
    maxSpeed = parseFloat(this.value);
}

lifeSpanControl.oninput = function() {
    lifeSpan = parseFloat(this.value);
}

gravityXControl.oninput = function() {
    gravity.x = parseFloat(this.value);
}

gravityYControl.oninput = function() {
    gravity.y = parseFloat(this.value);
}

function rndRange(min, max) {
    return Math.random() * (max - min) + min; 
}

// Update
setInterval(() => {
    // This interval is for updating instances only, it should not contain
    // Anything visual related

    // remove particles (dead or exited)
    for (let i = 0; i < particles.length; i++) {

        // Particle out of screen
        if (particles[i].x > canvas.width || particles[i].x < 0
            || particles[i].y > canvas.height || particles[i].y < 0
        ) { particles.splice(i, 1); }

        // Particle dead
        if (particles[i].lifeSpan <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].lifeSpan -= 1000 / updateRate
        }
    }

    // Move particles
    for (let i = 0; i < particles.length; i++) {
        // Apply gravity
        particles[i].motion.x += gravity.x; 
        particles[i].motion.y += gravity.y;

        // Update position based on movement
        particles[i].x += particles[i].motion.x;
        particles[i].y += particles[i].motion.y;
    }

    // Create new particles
    let a = rndRange(0, spread); // Angle (from center)
    let d = rndRange(0, emissionRadius); // Distance (from center)

    let particleSpeed = rndRange(minSpeed, maxSpeed);
    let particleAngle = angle + rndRange(-spread / 2, spread / 2);

    particles.push({
        x: canvas.width / 2 + Math.cos(a) * d,
        y: canvas.height / 2 + Math.sin(a) * d,
        speed: particleSpeed,
        angle: particleAngle,
        motion: {
            x: particleSpeed * Math.cos(particleAngle),
            y: particleSpeed * Math.sin(particleAngle),
        },
        lifeSpan: lifeSpan * 1000
    });

}, 1000 / updateRate);

// Render
setInterval(() => {
    // This interval is only used to draw the particles on screen. Everything else
    // should be in the "update" interval

    // resize canvas to fit the screen
    canvas.width = document.querySelector('.canvas-container').clientWidth;
    canvas.height = document.querySelector('.canvas-container').clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(particles[i].x, particles[i].y, 5, 5);
    }

}, 1000 / frameRate);