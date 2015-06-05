var line = [];
var w = 0;
var h = 0;
var now = false;
var hovered = false;
var detectClick = false;
var currentTown = {
    "name": "",
    "left": -100,
    "top": -100,
    "pct": 0
};
var colors = [
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [210, 77, 87],
    [210, 77, 87],
    [210, 77, 87],
    [210, 77, 87],
    [247, 202, 24]
];
var opac = 150;
var term = "";
var searched = false;
var years = ["2012/13", "2011/12", "2010/11", "2009/10", "2008/09", "2007/08", "2006/07", "2005/06", "2004/05", "2003/04", "2002/03", "2001/02", "2000/01", "1999/00", "1998/99", "1997/98", "1996/97", "1995/96", "1994/95", "1993/94", "1992/93", "1991/92", "1990/91", "1989/90", "1988/89", "1987/88", "1986/87", "1985/86", "1984/85"];
years.reverse();
var yearsLength = years.length;
var clickedYear = yearsLength - 1;
Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
var dataLength = Object.size(data);
var clickX = -100;
var clickY = -100;

var hoverCity = {
    name: "",
    left: 0,
    top: 0,
    run: function() {
        if (hovered) {
            line[0].hover(this.name, this.left, this.top);
        }
    }
}

jQuery(function($) {
    w = $(".chartContainer").width();
    h = $(".chartContainer").height();
    setInterval(function() {
        w = jQuery(".chartContainer").width();
        h = jQuery(".chartContainer").height();
    }, 20);
    $("#search").change(function() {
        term = $(this).val();
    });
    // $(".flip").click(function() {
    //     now = !now;
    // });
});



function setup() {
    createCanvas(1600, 600);
    for (var i = 0; i < dataLength; i++) {
        line[i] = new Line(data[i], i, data[i].town);
    }
    frameRate(20);
}
var tooltip;

function draw() {
    background([40, 40, 40]);
    noStroke();
    tooltip = false;
    hovered = false;
    for (var i = 0; i < data.length; i++) {
        if (term == "") {
            line[i].run(0);
        } else {
            if (data[i].town.toLowerCase().indexOf(term.toLowerCase()) != -1) {
                line[i].run(1);
            } else {
                line[i].run(2);
            }
        }
    }
    for (var i = 0; i < data.length; i++) {
        line[i].texter();
    }
    if (!now) {
        labels();
    }

    yearLabel();
    textSize(14);
    textStyle(BOLD);
    if (hovered) {
        text(currentTown.name + " (" + Math.round(currentTown.pct * 100) / 100 + ")", currentTown.left - 10, currentTown.top - 10);
    }
}


function labels() {
    var jumper = 1;
    if (w < 650) {
        jumper = 3;
    }
    textFont("Lato");
    textSize(13);
    fill(255);
    for (var i = 0; i < yearsLength; i += jumper) {
        var left = (i + 1) / (yearsLength + 1) * (w - 100) + 50;
        text(years[i].split("/")[0].slice(-2), left - 8, h - 20);
    }
    for (var i = 0; i < 85; i += 5) {
        var top = (h - 50) - (i / 100 * h);
        stroke(255, 40);
        strokeWeight(1);
        line(0, top, w, top);
        text(i, 10, top);
    }
}

function yearLabel() {
    fill(255);
    textSize(24);
    textStyle(NORMAL)
    textAlign(CENTER);
    if (now) {
        text(years[clickedYear], w / 2, 50);
    } else {
        text("Click town to view the year on a map", w / 2, 50);
    }
}

function mouseReleased() {
    clickX = mouseX;
    clickY = mouseY;
    detectClick = true;
    if (now) {
        now = !now;
        detectClick = false;
    }
}


function Line(d, num, t) {
    this.d = d;
    this.n = num;
    this.town = t;
    this.lefter = 0;
    this.topper = 0;
    this.sizer = 0;
    this.backout = -Math.random() * 1000 - 100;
    this.opac = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.speed = Math.random() * 0.1 + 0.3;
    this.lefter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.topper = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}


Line.prototype.run = function(op) {
    for (var i = 0; i < yearsLength; i++) {
        this.makeCircle(years[i], i, op);
    }
}

Line.prototype.makeCircle = function(y, num, hl) {
    var opac = this.opac;
    var d = this.d[y];
    var left = (num + 1) / (yearsLength + 1) * (w - 100) + 50;
    var top = (h - 50) - (d / 100 * h);
    var size = getRadius(d);

    var opac = 100;
    if (now && num == clickedYear) {
        top = (42.293425 - geo[this.town].lat) / 1.594564 * h;
        left = (-74.310400 - geo[this.town].lng) / -3.00124 * w;
        opac = 200;
    } else if (now && num != clickedYear) {
        top = this.backout;
        left = this.backout;
        opac = 0;
    }
    this.opac[num] = lerp(this.opac[num], opac, this.speed);

    var fillcol = [
        [210, 215, 211, this.opac[num]],
        [189, 195, 199, this.opac[num]],
        [245, 215, 110, this.opac[num]],
        [247, 202, 24, this.opac[num]],
        [244, 179, 80, this.opac[num]],
        [232, 126, 4, this.opac[num]],
        [239, 72, 54, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]],
        [242, 38, 19, this.opac[num]]
    ];


    this.lefter[num] = lerp(this.lefter[num], left, this.speed);
    this.topper[num] = lerp(this.topper[num], top, this.speed);

    if (hl == 1) {
        size = w / 40;
    } else if (hl == 2) {
        size = 0;
    }

    if (!tooltip && dist(this.lefter[num], this.topper[num], clickX, clickY) < size && !now && detectClick) {
        clickedYear = num;
        now = !now;
        detectClick = false;
        fillcol[Math.floor(d / 4)][3] = 220;
    } else if (dist(this.lefter[num], this.topper[num], mouseX, mouseY) < size && !hovered && (term == "" || hl == 1)) {
        currentTown.name = this.town;
        currentTown.left = left;
        currentTown.top = top;
        currentTown.pct = d;
        hovered = true;
        fillcol[Math.floor(d / 4)][3] = 220;
    }
    fill(fillcol[Math.floor(d / 4)]);
var shape = "ellipse";
    eval(shape)(this.lefter[num], this.topper[num], size, size);
}



Line.prototype.texter = function() {
    var d = this.d[years[clickedYear]];
    var size = getRadius(d);
    var top = (42.293425 - geo[this.town].lat) / 1.594564 * h;
    var left = (-74.310400 - geo[this.town].lng) / -3.00124 * w;
    textSize(14);
    fill(255, 200);
    if (size > 12 && now) {
        push();
        translate(left, top);
        rotate(-Math.PI / 4);
        text(this.town, 0, -size / 2 - 1);
        pop();
    }
}

function getRadius(d) {
    if (now) {
        var v = d / 2 / Math.PI * w / 300;
        if (v < 7) {
            return 7;
        } else {
            return v;
        }
    } else {
        return Math.sqrt(d) / Math.PI * w / 100;
    }
}
