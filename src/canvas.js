'use strict';
let ctx, canvasWidth, canvasHeight;
let shapes = [];

function draw(){
    let canvas;
    canvas = document.getElementById("canvas");
    if(!canvas){
        canvas = createCanvas();
    }
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;

    if (canvas.getContext) {
        ctx = canvas.getContext("2d");

        let triangle = new Triangle(new Coord(44, 44), new Coord(0, 0), new Coord(0, 68), getRandomColor());
        let rect = new Rectangle(new Coord(400, 400), 50, 50, getRandomColor());
        let circle = new Circle(new Coord(70, 22), 10, getRandomColor());
        shapes.push(rect);
        shapes.push(triangle);
        shapes.push(circle);

        render();

    }
}

function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    shapes.forEach(function (element) {
        element.move(ctx, shapes);
        element.draw(ctx);
    });
    setTimeout(() => render.apply(this, arguments), 10);
}


function createCanvas(){
    let body = document.getElementsByTagName("BODY")[0];
    let canvas = document.createElement("CANVAS");
    canvas.attributes.width = "360px";
    canvas.attributes.height = "360px";
    canvas.style = "border: solid 1px black;";
    body.appendChild(canvas);
    return canvas;
}

function getRandomColor (){
    function getRandomOctet(){
        return Math.floor(Math.random()*255);
    }
    return `rgb(${getRandomOctet()}, ${getRandomOctet()}, ${getRandomOctet()})`;
}