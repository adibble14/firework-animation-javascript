var canvas = document.getElementById("Canvas"); //retrieves a reference to an HTML canvas element with the id "Canvas"
var ctx = canvas.getContext("2d"); //gets its 2D rendering context which allows you to draw and manipulate graphics on the canvas using JavaScript

var message = document.getElementById("message");
var messages = ["Happy Birthday!", "Congratulations!", "Happy Work Anniversary!", "Happy New Year!", "Happy Holidays!"];
message.textContent = messages[Math.floor(Math.random() * 5)]

var canvasWidth, canvasHeight;
var lastRun = 0; //time since the last run of the run function
var startTime = 0; //time when the button was clicked
var dt = 1; //time difference between the current frame and the previous frame
var animationRunning = false; //if the animation is running or not
var fireworks = [];
var particles = [];
var colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];

window.onresize = function () { ResetDimensions(); } //When the window is resized, the reset() function is called to adjust the dimensions of the canvas element to match the new dimensions of the window.
ResetDimensions();

var button = document.getElementById('myButton');
// Add a click event listener to the button
button.addEventListener('click', function () {
    message.textContent = messages[Math.floor(Math.random() * 5)];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationRunning = false;
    setTimeout(function () { //adding a little delay to let prior execution to exit
        lastRun = 0;
        dt = 1;
        startTime = performance.now();
        fireworks = [];
        particles = [];
        animationRunning = true;
        Run();
    }, 20);
});

//resets the dimensions of the canvas element to match the dimensions of the window
function ResetDimensions() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

//creates a new Firework
function CreateFirework() {
    var left = (Math.random() > 0.5); //randomly determines whether the firework will initially move left or right.
    var firework = {}; //creating firework object
    firework.xCoord = (1 * left); //setting innitial x and y coordinates (between 0 and 1)
    firework.yCoord = 1;
    firework.xOffset = (0.01 + Math.random() * 0.007) * (left ? 1 : -1); //random horizontal offset
    firework.yOffset = 0.01 + Math.random() * 0.007; //random vertical offset
    firework.size = Math.random() * 6 + 3; //size of firework (adding variation to size of the circle)
    firework.color = colors[Math.floor(Math.random() * colors.length)];

    fireworks.push(firework); //adding to fireworks list
}

//creates a burst or explosion animation for the firework
function CreateBurst(firework) {
    //the number of particles that appear after the firework bursts, calculated based on the size
    var particleCount = Math.ceil(Math.pow(firework.size, 2) * Math.PI);

    //generate particles
    for (i = 0; i < particleCount; i++) {

        var particle = {}; //creating particle object
        particle.xCoord = firework.xCoord * canvasWidth; //setting initial coordinates to position of the firework
        particle.yCoord = firework.yCoord * canvasHeight;

        var a = Math.random() * 4; //random angle
        var s = Math.random() * 10; //random speed

        particle.xOffset = s * Math.sin((5 - a) * (Math.PI / 2)); //direction of movement.
        particle.yOffset = s * Math.sin(a * (Math.PI / 2));

        particle.color = firework.color;
        particle.size = Math.sqrt(firework.size); //making the particle smaller than the firework

        if (particles.length < 1000) { particles.push(particle); }
    }
}

//runs the firework animation
function Run() {
    //dt (delta time) calculates the time difference between the current frame and the previous frame
    //used to update positions and sizes of fireworks and particles to ensure smooth animation
    if (lastRun != 0) {
        dt = Math.min(50, ((performance.now() - startTime) - lastRun));
    }
    lastRun = (performance.now() - startTime); //current timestamp in milliseconds

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); //draws a filled rectangle on the canvas context

    if ((fireworks.length < 10) && (Math.random() > 0.96) && ((performance.now() - startTime) < 3000)) { //limiting how many fireworks are created
        CreateFirework(); //creates a new firework
    }

    for (let indexOfFirework in fireworks) {
        if (animationRunning) {
            var currentFirework = fireworks[indexOfFirework];

            //adding the firework (as a circle)
            ctx.beginPath();
            //x and y coordinates multiplied by canvas size to fit the full page
            ctx.arc(currentFirework.xCoord * canvasWidth, currentFirework.yCoord * canvasHeight, currentFirework.size, 0, 2 * Math.PI);
            ctx.fillStyle = currentFirework.color;
            ctx.fill();

            //updating the coordinates to act as a firework shooting out into the sky animation
            currentFirework.xCoord -= currentFirework.xOffset;
            currentFirework.yCoord -= currentFirework.yOffset;
            currentFirework.xOffset -= (currentFirework.xOffset * dt * 0.001);
            currentFirework.yOffset -= ((currentFirework.yOffset + 0.2) * dt * 0.00005);

            //after the firework has peaked, create a firework burst or explosion
            if (currentFirework.yOffset < -0.005) {
                CreateBurst(currentFirework); //creating a burst for the firework
                fireworks.splice(indexOfFirework, 1); //removing the firework from the array
            }
        } else { return; }
    }

    for (let indexOfParticle in particles) {
        if (animationRunning) {
            var particle = particles[indexOfParticle];

            //drawing the particle
            ctx.beginPath();
            ctx.arc(particle.xCoord, particle.yCoord, particle.size, 0, 2 * Math.PI);
            ctx.fillStyle = particle.color;
            ctx.fill();

            //updating particle position and size to act as bursting animation
            particle.xCoord -= particle.xOffset;
            particle.yCoord -= particle.yOffset;
            particle.xOffset -= (particle.xOffset * dt * 0.001);
            particle.yOffset -= ((particle.yOffset + 5) * dt * 0.0005);
            particle.size -= (dt * 0.002 * Math.random())

            //checks if particle has moved out of bounds or if size is too small, if so then removes it
            if ((particle.y > canvasHeight) || (particle.y < -50) || (particle.size <= 0)) {
                particles.splice(indexOfParticle, 1);
            }
        } else { return; }
    }

    if ((((performance.now() - startTime) < 2000) || (fireworks.length > 0) || (particles.length > 0)) && animationRunning) { //if there are still some fireworks/particles left then run the loop (make sure they burst)
        requestAnimationFrame(Run); //animation loop
    } else {
        return;
    }

}