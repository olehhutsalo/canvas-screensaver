'use strict';
//Class for coordinate
function Coord(x, y){
    this.x = x;
    this.y = y;
}
Coord.prototype.shiftCoord = function (x,y) {
    this.x += x;
    this.y += y;
};

//Shapes class
function Shape() {
    this.type = 'shape';
    this.path = [];
    this.moveAngle = Math.random() * 2 * Math.PI;
    this.color = 'rgb(0,0,0)'
}

Shape.prototype.draw = function (context) {
    ctx.beginPath();

    let coord = this.path[0];
    context.moveTo(Math.floor(coord.x), Math.floor(coord.y));

    for (let i = 1; i < this.path.length; i++){
        let coord = this.path[i];
        ctx.lineTo(Math.floor(coord.x), Math.floor(coord.y));
    }

    context.closePath();

    context.fillStyle = this.color;
    context.fill();
};

Shape.prototype.move = function (context, shapesList) {
    shapesList = shapesList.filter(el => el.path !== this.path);

    for (let i = 0; i < this.path.length; i++){
        let nextPointLocation = {
            x: this.path[i].x + Math.cos(this.moveAngle),
            y: this.path[i].y + Math.sin(this.moveAngle)
        };

        //Bounce from borders
        let borders = [{x: 0, y: 0}, {x: 0, y: canvasHeight}, {x: canvasWidth, y: canvasHeight}, {x: canvasWidth, y: 0}];
        let intersection = window.myMath.checkIntersection(borders, nextPointLocation);
        if (!intersection.intersected){
            this.moveAngle = window.myMath.changeAngle(intersection.closestSegment.A,
                intersection.closestSegment.B, nextPointLocation, this.moveAngle);
        }

        //Bounce from other shapes
        for (let j = 0; j < shapesList.length; j++){
            let intersection = window.myMath.checkIntersection(shapesList[j].path, nextPointLocation);
            if (intersection.intersected){
                this.moveAngle = window.myMath.changeAngle(intersection.closestSegment.A,
                    intersection.closestSegment.B, nextPointLocation, this.moveAngle);
            }
        }
    }

    //Change position
    for (let i = 0; i < this.path.length; i++){
        let xShift = Math.cos(this.moveAngle);
        let yShift = Math.sin(this.moveAngle);

        this.path[i].shiftCoord(xShift, yShift);
    }
};

//Rectangle class
function Rectangle(coord, width, height, color){
    Shape.apply(this, arguments);

    this.type = 'rectangle';
    this.path = [
        new Coord(coord.x, coord.y),
        new Coord(coord.x + width, coord.y),
        new Coord(coord.x + width, coord.y + height),
        new Coord(coord.x, coord.y + height)
    ];
    this.color = color;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

//Triangle class
function Triangle(coord1, coord2, coord3, color){
    Shape.apply(this, arguments);

    this.type = 'triangle';
    this.path = [
        coord1,
        coord2,
        coord3
    ];
    this.color = color;
}

Triangle.prototype = Object.create(Shape.prototype);
Triangle.prototype.constructor = Rectangle;

//Circle class
function Circle(coord, radius, color){
    Shape.apply(this, arguments);

    this.type = 'circle';
    this.path = [
        coord
    ];
    this.radius = radius;
    this.color = color;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Rectangle;

Circle.prototype.draw = function (context) {
    let coord = this.path[0];
    context.arc(Math.floor(coord.x), Math.floor(coord.y), this.radius, 0, 2 * Math.PI);
    context.fill();
};
