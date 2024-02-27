//creates a new div element that acts as the container for the animation
var container = document.createElement("DIV");
document.body.insertBefore(container, document.getElementById("container"));

//arrays
fireworks = [];
particles = [];
bursts = [];
messages = [];

//variables
var messageContent = ["Happy Birthday!", "Congratulations!", "Happy Work Anniversary!", "Happy New Year!", "Happy Holidays!"];
var count = messageContent.length; //how many times the animation has run to determine which message to show
var messageInterval = null; var timeInterval = null; var message = null; var lastRun = 0; //initializing
const particleInitialVelocity = 0.5; //initial velocity for particle
const fireworkInitialVelocity = 0.5; //initial velocity for firework
const particleInitialTime = 2500; //how long the particle survives in millseconds
const fireworkInitialTime = 1000; //how long the firework survives in millseconds
const airResistance = 0.0005;
const gravitationalPull = 0.0005;
const velocityVariation = 0.3; //controls the amount of randomness in the velocity of the particles

//creates a new message that fades in and out
function newMessage() {
    if (messages.length > 0) {
        for (i in messages) {
            var m = messages[i];
            m.parentNode.removeChild(m); //removing message from the container and the array
        }
        messages = [];
    }

    message = document.createElement("DIV");
    message.setAttribute('class', 'header-message');
    message.textContent = messageContent[count - 1];
    message.style.fontSize = "50px";
    message.style.fontWeight = "bold";
    container.appendChild(message);
    count--;

    if (messages == null)
        messages = [];
    messages.push(message);
}

//creates a new firework, the firework is the initial point that is clicked on to create the firework
function newFirework(x, y) {
    var firework = document.createElement("DIV");
    firework.setAttribute('class', 'firework');
    firework.time = fireworkInitialTime;
    firework.velocity = [];
    firework.velocity.x = 0;
    firework.velocity.y = fireworkInitialVelocity;
    firework.position = [];
    firework.position.x = x;
    firework.position.y = y;
    firework.style.left = firework.position.x + 'px';
    firework.style.top = firework.position.y + 'px';
    container.appendChild(firework);

    if (fireworks == null)
        fireworks = [];
    fireworks.push(firework);
}

//creates a new burst, the burst is the collection of particles that are created when the firework explodes
function newBurst(x, y) {
    var burst = document.createElement("DIV");
    burst.setAttribute('class', 'burst');
    var airResistance = 0;
    while (airResistance < 360) {
        var particle = newParticle(x, y, airResistance);
        burst.appendChild(particle);
        airResistance += 5;
    }
    container.appendChild(burst);

    if (bursts == null)
        bursts = [];
    bursts.push(burst);
}

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

//starting the animation when button is clicked
var button = document.getElementById('myButton');
button.addEventListener('click', startAnimation);// Add a click event listener to the button
function startAnimation() {
    lastRun = Date.now();
    timeInterval = setInterval(run, 5); //runs the run function every 5 milliseconds
    button.disabled = true;
    button.style.opacity = "0.5";
    count = messageContent.length;
    messages = [];

    //creating fireworks and adding message
    newFirework(window.innerWidth * 0.55, window.innerHeight * 0.65);
    newFirework(window.innerWidth * 0.45, window.innerHeight * 0.65);
    newFirework(window.innerWidth * 0.6, window.innerHeight * 0.78);
    newFirework(window.innerWidth * 0.5, window.innerHeight * 0.78);
    newFirework(window.innerWidth * 0.4, window.innerHeight * 0.78);
    newMessage();

    //after 5 seconds switch to a new message and more fireworks
    messageInterval = setInterval(function () {
        newFirework(window.innerWidth * 0.55, window.innerHeight * 0.65);
        newFirework(window.innerWidth * 0.45, window.innerHeight * 0.65);
        newFirework(window.innerWidth * 0.6, window.innerHeight * 0.78);
        newFirework(window.innerWidth * 0.5, window.innerHeight * 0.78);
        newFirework(window.innerWidth * 0.4, window.innerHeight * 0.78);
        newMessage();
    }, 5000);
}

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
            newBurst(firework.position.x, firework.position.y);

            firework.parentNode.removeChild(firework); //removing firework from the container and the array
            fireworks.splice(i, 1);
        }
    }

    for (i in particles) {
        var particle = particles[i];
        particle.time -= deltaTime;
        if (particle.time > 0 && particle.position.y < window.innerHeight - 65 && particle.position.x >= 30 && particle.position.x <= window.innerWidth - 30) { //removing the particles after a certain time or if they go past the height/width of the window with a small buffer
            particle.velocity.x -= particle.velocity.x * airResistance * deltaTime;
            particle.velocity.y -= gravitationalPull * deltaTime + particle.velocity.y * airResistance * deltaTime;
            particle.position.x += particle.velocity.x * deltaTime;
            particle.position.y -= particle.velocity.y * deltaTime;
            particle.style.left = particle.position.x + 'px';
            particle.style.top = particle.position.y + 'px';
        }
        else {
            particle.parentNode.removeChild(particle); //removing particle from the container and the array
            particles.splice(i, 1);

            if (count <= 0 && particles.length == 0) { //the animation is over, resetting it
                clearInterval(timeInterval); //stopping the animation loops
                clearInterval(messageInterval);
                button.disabled = false;
                button.style.opacity = "1";

                while (container.firstChild) { //removing old elements
                    container.removeChild(container.firstChild);
                }

                button.addEventListener('click', startAnimation); // Re-add the click event listener to the button
            }
        }
    }
}