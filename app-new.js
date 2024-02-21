var container = document.createElement("DIV");
document.body.insertBefore(container, document.getElementById("container"));

fireworks = [];
particles = [];

const particleInitialVelocity = 0.5; //initial velocity for particle
const fireworkInitialVelocity = 0.5; //initial velocity for seed
const particleInitialTime = 2500; //how long the particle survives in millseconds
const fireworkInitialTime = 1000; //how long the seed survives in millseconds
const airResistance = 0.0005;
const gravitationalPull = 0.0005;
const velocityVariation = 0.3; //controls the amount of randomness in the velocity of the particles
const cursorXOffset = 5; //used to adjust the position of the firework seed relative to the position where the user clicks on the webpage
const cursorYOffset = 0;

//creates a new particle, particles are the individual dots that make up the firework
function newParticle(x, y, angle) {
    var particle = document.createElement("DIV");
    particle.setAttribute('class', 'particle');
    particle.time = particleInitialTime;
    while (angle > 360)
        angle -= 360;
    while (angle < 0)
        angle += 360;
    particle.velocity = [];
    if (angle > 270) {
        particle.velocity.x = particleInitialVelocity * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
        particle.velocity.y = particleInitialVelocity * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
    }
    else if (angle > 180) {
        particle.velocity.x = particleInitialVelocity * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
        particle.velocity.y = particleInitialVelocity * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
    }
    else if (angle > 90) {
        particle.velocity.x = particleInitialVelocity * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
        particle.velocity.y = particleInitialVelocity * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
    }
    else {
        particle.velocity.x = particleInitialVelocity * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
        particle.velocity.y = particleInitialVelocity * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * velocityVariation);
    }
    particle.position = [];
    particle.position.x = x;
    particle.position.y = y;
    particle.style.left = particle.position.x + 'px';
    particle.style.top = particle.position.y + 'px';
    if (particles == null)
        particles = [];
    particles.push(particle);
    return particle;
}

document.addEventListener("click", newFireWorkOnClick);

function newFireWorkOnClick(event) {
    newFirework(event.pageX - container.offsetLeft + cursorXOffset, event.pageY - container.offsetTop + cursorYOffset);
}

//creates a new firework, the firework is the initial point that is clicked on to create the firework
function newFirework(x, y) {
    var firework = document.createElement("DIV");
    firework.setAttribute('class', 'firework');
    container.appendChild(firework);
    firework.time = fireworkInitialTime;
    firework.velocity = [];
    firework.velocity.x = 0;
    firework.velocity.y = fireworkInitialVelocity;
    firework.position = [];
    firework.position.x = x;
    firework.position.y = y;
    firework.style.left = firework.position.x + 'px';
    firework.style.top = firework.position.y + 'px';
    if (fireworks == null)
        fireworks = [];
    fireworks.push(firework);
    return firework;
}

//creates a new star, the star is the collection of particles that are created when the firework explodes
function newStar(x, y) {
    var star = document.createElement("DIV");
    star.setAttribute('class', 'star');
    var airResistance = 0;
    while (airResistance < 360) {
        var particle = newParticle(x, y, airResistance);
        star.appendChild(particle);
        airResistance += 5;
    }
    container.appendChild(star);
}

var lastRun = Date.now();
var timeInterval = setInterval(run, 5); //runs the run function every 5 milliseconds

//the animation function
function run() {
    var currentRun = Date.now();
    var deltaTime = currentRun - lastRun;
    lastRun = currentRun;
    for (i in fireworks) {
        var firework = fireworks[i];
        firework.time -= deltaTime;
        if (firework.time > 0) {
            firework.velocity.x -= firework.velocity.x * airResistance * deltaTime;
            firework.velocity.y -= gravitationalPull * deltaTime + firework.velocity.y * airResistance * deltaTime;
            firework.position.x += firework.velocity.x * deltaTime;
            firework.position.y -= firework.velocity.y * deltaTime;
            firework.style.left = firework.position.x + 'px';
            firework.style.top = firework.position.y + 'px';
        }
        else {
            newStar(firework.position.x, firework.position.y);
            firework.parentNode.removeChild(firework);
            fireworks.splice(i, 1);
        }
    }
    for (i in particles) {
        var particle = particles[i];
        particle.time -= deltaTime;
        if (particle.time > 0) {
            particle.velocity.x -= particle.velocity.x * airResistance * deltaTime;
            particle.velocity.y -= gravitationalPull * deltaTime + particle.velocity.y * airResistance * deltaTime;
            particle.position.x += particle.velocity.x * deltaTime;
            particle.position.y -= particle.velocity.y * deltaTime;
            particle.style.left = particle.position.x + 'px';
            particle.style.top = particle.position.y + 'px';
        }
        else {
            particle.parentNode.removeChild(particle);
            particles.splice(i, 1);
        }
    }
}