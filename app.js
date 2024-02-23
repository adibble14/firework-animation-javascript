var container = document.createElement("DIV"); //creates a new div element that acts as the container for the animation
document.body.insertBefore(container, document.getElementById("container"));

fireworks = [];
particles = [];
messages = [];

var messageContent = ["Happy Birthday!", "Congratulations!", "Happy Work Anniversary!", "Happy New Year!", "Happy Holidays!"];
var count = messageContent.length; //how many times the animation has run to determine which message to show

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

var button = document.getElementById('myButton');
button.addEventListener('click', startAnimation);// Add a click event listener to the button
function startAnimation() {

    button.disabled = true;
    button.style.opacity = "0.5";

    newFirework(850, 600);
    newFirework(1050, 600);
    newFirework(750, 700);
    newFirework(950, 700);
    newFirework(1150, 700);
    newMessage();

    //after the play button is pushed and after 5 seconds switch to a new message and more fireworks
    var messageInterval = setInterval(function () {
        newFirework(850, 600);
        newFirework(1050, 600);
        newFirework(750, 700);
        newFirework(950, 700);
        newFirework(1150, 700);
        newMessage();

        if (count == 0) { //after looping through all the messages in the list stop the animation and resetting it
            clearInterval(messageInterval);
            button.disabled = false;
            button.style.opacity = "1";
            count = messageContent.length;
        }
    }, 5000);
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
}

//creates a new message that fades in and out
function newMessage() {
    if (messages.length > 0) {
        for (i in messages) {
            var m = messages[i];
            m.parentNode.removeChild(m); //removing message from the container and the array
        }
        messages = [];
    }

    var message = document.createElement("DIV");
    message.setAttribute('class', 'message');
    message.textContent = messageContent[count - 1];
    count--;
    container.appendChild(message);
    message.position = [];
    message.style.left = "50%";
    message.style.top = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.fontSize = "50px";
    message.style.fontWeight = "bold";

    if (messages == null)
        messages = [];
    messages.push(message);
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
            newBurst(firework.position.x, firework.position.y);

            firework.parentNode.removeChild(firework); //removing firework from the container and the array
            fireworks.splice(i, 1);
        }
    }
    for (i in particles) {
        var particle = particles[i];
        particle.time -= deltaTime;
        if (particle.time > 0 && particle.position.y < window.innerHeight - 50) { //removing the particles after a certain time or if they go past the height of the window with a small buffer
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
        }
    }
}