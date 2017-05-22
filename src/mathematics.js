(function(){
    'use strict';
    let myMath = {};

    myMath.checkIntersection = function (polygon, point) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = point.x, y = point.y;

        let closestLength = Number.MAX_VALUE;
        let closestSegment = {};

        var inside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let vertex1 = polygon[i];
            let vertex2 = polygon[j];

            var intersect = ((vertex1.y > y) != (vertex2.y > y))
                && (x < (vertex2.x - vertex1.x) * (y - vertex1.y) / (vertex2.y - vertex1.y) + vertex1.x);
            if (intersect) inside = !inside;

            let currentLength = myMath.lengthFromPointToSegment(vertex1, vertex2, point);
            if(currentLength < closestLength){
                closestLength = currentLength;
                closestSegment = {A: vertex1, B: vertex2}
            }
        }

        return {
            intersected: inside,
            closestSegment: closestSegment
        };
    };

    myMath.lengthFromPointToSegment = function (vertex1, vertex2, point) {
        //We are working with triangle, and the altitude from 'point'
        // to segment (vertex1, vertex2) is a result
        let area = rectangleArea(vertex1, vertex2, point);

        //If all 3 points lies on 1 line -- we determine closest vertex to the 'ponit'
        if(area == 0){
            return Math.min( lineSegmentLength(vertex1, point), lineSegmentLength(vertex2, point));
        }

        return (area * 2) / Math.abs(lineSegmentLength(vertex1, vertex2));

        function rectangleArea(A, B, C){
            return 1 / 2 * Math.abs( (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y) );
        }

        function lineSegmentLength(A, B){
            return Math.sqrt( (B.x - A.x) ** 2 + (B.y - A.y) ** 2);
        }
    };

    myMath.changeAngle = function (vertex1, vertex2, point, moveAngle) {
        let angleSegment, angleVector;
        let point2 = {
            x: point.x + Math.cos(moveAngle),
            y: point.y + Math.sin(moveAngle)
        };
        if (vertex2.x - vertex1.x == 0){
            angleSegment = 0;
        }else {
            angleSegment = Math.atan((vertex2.y - vertex1.y) / (vertex2.x - vertex1.x));
        }

        if (point2.x - point.x == 0){
            angleVector = 0;
        }else {
            angleVector =  Math.atan((point2.y - point.y) / (point2.x - point.x));
        }

        let angleDiff = Math.PI / 2 - (angleSegment - angleVector);
        return (angleDiff * 2 + Math.PI + angleVector) % (Math.PI * 2);
    };

    window.myMath = myMath;
}());