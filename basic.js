//Ineterval control 
function Interval(fn, time) {
    var timer = false;
    this.start = function () {
        if (!this.isRunning())
        timer = setInterval(fn, time);
    };
    this.stop = function () {
        clearInterval(timer);
        timer = false;
    };
    this.isRunning = function () {
        return timer !== false;
    };
}

//function to reshape the array 
Array.prototype.reshape = function (rows, cols) {
    var copy = this.slice(0); // Copy all elements.
    this.length = 0; // Clear out existing array.
    for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < cols; c++) {
            var i = r * cols + c;
            if (i < copy.length) {
                row.push(copy[i]);
            }
        }
        this.push(row);
    }
}

//draw a line on canvas
function line(ctx, stroke, width, x, y, nx, ny) {
    ctx.beginPath()
    ctx.strokeStyle = stroke
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = width
    ctx.moveTo(x, y)
    ctx.lineTo(nx, ny)
    ctx.stroke()
}

//simplify a curve
function rdp(points, tolerance){
    let rdppoints = new Array()
    let start = points[0]
    let end = points[points.length-1]
    rdppoints.push(start)
    g(0, points.length-1, points, rdppoints, tolerance)
    rdppoints.push(end)
    return rdppoints
}
function g(start, end, points, rdppoints, tolerance) {
    let nextIndex = o(points, start, end, tolerance)
    let nextPoint = points[nextIndex]
    if (nextIndex > 0) {
        if(start != nextIndex){
            g(start, nextIndex, points, rdppoints, tolerance)
        }
        rdppoints.push(nextPoint)
        if(end != nextIndex)
        g(nextIndex, end, points, rdppoints, tolerance)
    }
}
function perpendicularDistance(a, b, c){
    return 100
}
function o(arr, a, b, tolerance) {
    let maxDistance = 0
    let index 
    for(let i=a+1; i<b; i++){
        let d = perpendicularDistance(arr[a], arr[b], arr[i])
        if(d>maxDistance){
            maxDistance = d
            index = i
        }
    }
    if(maxDistance>tolerance){
        return index
    }else{
        return -1
    }
}

//rdp 2
function simplifyPath(points, tolerance) {
    // helper classes 
    var Vector = function (x, y) {
        this.x = x;
        this.y = y;
        
    };
    var Line = function (p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        
        this.distanceToPoint = function (point) {
            // slope
            var m = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x),
            // y offset
            b = this.p1.y - (m * this.p1.x),
            d = [];
            // distance to the linear equation
            d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
            // distance to p1
            d.push(Math.sqrt(Math.pow((point.x - this.p1.x), 2) + Math.pow((point.y - this.p1.y), 2)));
            // distance to p2
            d.push(Math.sqrt(Math.pow((point.x - this.p2.x), 2) + Math.pow((point.y - this.p2.y), 2)));
            // return the smallest distance
            return d.sort(function (a, b) {
                return (a - b); //causes an array to be sorted numerically and ascending
            })[0];
        };
    };
    
    var douglasPeucker = function (points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }
        var returnPoints = [],
        // make line from start to end 
        line = new Line(points[0], points[points.length - 1]),
        // find the largest distance from intermediate poitns to this line
        maxDistance = 0,
        maxDistanceIndex = 0,
        p;
        for (var i = 1; i <= points.length - 2; i++) {
            var distance = line.distanceToPoint(points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }
        // check if the max distance is greater than our tollerance allows 
        if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            line.distanceToPoint(p, true);
            // include this point in the output 
            returnPoints = returnPoints.concat(douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
            // returnPoints.push( points[maxDistanceIndex] );
            returnPoints = returnPoints.concat(douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
        } else {
            // ditching this point
            p = points[maxDistanceIndex];
            line.distanceToPoint(p, true);
            returnPoints = [points[0]];
        }
        return returnPoints;
    };
    var arr = douglasPeucker(points, tolerance);
    // always have to push the very last point on so it doesn't get left off
    arr.push(points[points.length - 1]);
    return arr;
};
///end