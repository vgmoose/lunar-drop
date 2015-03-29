var zoom = 1;
var canvas;
var context;
var gridIsOn = true;
var time;
var defaultImg;
var dragging = null;

/*
TODO:
make sidebar refresh with selection
make sidebar buttons actually affect map
make bezier curves
remove point, remove keyframe, remove character
splice keyframe
make character animate along path
make tileset things
make movement things
warps
events
on this map
schedule
timelines
exporting of data to ld files
save data using local storage
multiple map editing

DONE:
time bar along bottom
formatting of panels and main
keyframe adding
zooming
grid
time textbox in corner
fields in sidebar
right click context menu
quadratic curves
linear paths
*/

var map = {width: 44, height: 32, chars: []};

$(document).ready(function(){
    $("#timeslide").on("input", function(){
        time = $(this).val();
        draw();
        $("#timebox").val(convertMinutesToTime(time));
    });
    $("#timebox").on("input", function(){
        time = convertTimeToMinutes($(this).val());
        draw();
        $("#timeslide").val(time);
    });
    
    $("#timebox").val("06:00");
    time = 0;
    
    canvas = document.getElementById('main');
    context = canvas.getContext('2d');
    
    $(canvas).on('contextmenu', function(e) {
        displayContextAt(parseInt(e.offsetX/zoom), parseInt(e.offsetY/zoom), e.pageX, e.pageY);
        e.preventDefault();
    }); 
    
    $("body").on("click", function(e) {
        dismissContext();
    });
    
    $(canvas).on('mousedown', function(e) {
        dismissContext();
        
        var char = characterAt(e.offsetX/zoom, e.offsetY/zoom, false);
        
        // if there's a character on the mousedown position
        if (char)
            dragging = char;
        
        var point = pointAt(e.offsetX, e.offsetY);
        
        if (point)
            dragging = point;

        e.preventDefault();
    }); 
    
    $(canvas).on('mousemove', function(e) {
        
        if (dragging)
        {
            if (dragging.sched)
            {
                // update character coordinates while dragging
                dragging.sched[time].x = parseInt(e.offsetX/zoom/16);
                dragging.sched[time].y = parseInt(e.offsetY/zoom/16);
            }
            else if (dragging.cx1)
            {
                // this is now a quadratic line
                dragging.type = "quadratic";
                
                // update point coordinates while dragging
                dragging.cx1 = e.offsetX;
                dragging.cy1 = e.offsetY;
            }
            
            draw();
        }
        
        e.preventDefault();
    }); 
    
    $(canvas).on('mouseup', function(e) {
        
       dragging = null;
        
        e.preventDefault();
    }); 
    
    $("body").on("mousewheel", function(e) {
    dismissContext();
    if (e.ctrlKey) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if(e.originalEvent.wheelDelta /120 > 0) {
            zoom += 0.03;
        }
        else{
            zoom -= 0.03;
        }
        
        performZoom();

    }
        
});
    defaultImg = new Image();
    defaultImg.src = "images/bluemoon.png";
    
        context.imageSmoothingEnabled = false; /// future

    attachAllMenuListeners();
            draw();
});

function attachAllMenuListeners()
{
    $("#zoomout").click(function() { zoomOut() });
    $("#zoomin").click(function() { zoomIn() });
    $("#gridtoggle").click(function() { gridToggle() });
    
    // tabz
    $(".tab").click(function() { goTab((1+$(this).index())); });
};

function pointAt(px, py)
{
    var returnme = null;
    
    var chars = map.chars;
    for (var x=0; x<chars.length; x++)
    {
        var pos = chars[x].sched[time];
        
        if (!pos)
            continue;
        
        if (pos.cx1 >= px - 5 && pos.cx1 <= px +5
            && pos.cy1 >= py - 5 && pos.cy1 <= py + 5)
        {
            returnme = pos;
        }
    }
    
    return returnme;
}

function convertMinutesToTime(curMin)
{    
    curMin = parseInt(curMin) + 360;
    
    if (curMin >= 1440)
        curMin -= 1440;
    
    var hours = curMin/60.0;
    var minutes = Math.round((hours%1)*60);
    return pad(parseInt(hours)) + ":" + pad(minutes);
}

function pad(value)
{
    return ((value < 10)? "0":"") + value;
}

function convertTimeToMinutes(curTime)
{
    var thisTime = curTime.split(":");
    var curMin = parseInt(thisTime[0]*60) + parseInt(thisTime[1]);
    
    curMin -= 360;
    
    if (curMin < 0)
        curMin += 1440;
    
    return curMin;
}

function drawGrid()
{
    // draw lines
    for (var x=16.5; x<canvas.width; x+=16)
    {
        
        context.strokeStyle = 'rgba(170,170,170,0.7)';
        context.beginPath();
        context.moveTo(0.5, x);
        context.lineTo(canvas.width, x);
        context.stroke();
        
        context.beginPath();
        context.moveTo(x, 0.5);
        context.lineTo(x, canvas.height);
        context.stroke();
    }
    
}

function resizeCanvas()
{
    canvas.width = map.width*16;
    canvas.height = map.height*16;
}

function zoomIn()
{
    zoom += .25;
    zoom = (Math.round(zoom * 4) / 4);
    performZoom();
}

function zoomOut()
{
    zoom -= .25;
    zoom = (Math.round(zoom * 4) / 4);
    performZoom();
}

function performZoom()
{
    if (zoom < 0.1)
            zoom = 0.1;
        
        if (zoom > 2)
            zoom = 2;
                
        var width = zoom*canvas.width;
        var height = zoom*canvas.height;
        $('#main').css({'width': width+"px", 'height': height+"px"});
    
//        var divheight = parseInt($("#drawSpace").css('height'));
//        var divwidth = parseInt($("#drawSpace").css('width'));
//        
//        $('#main').css({'padding-left': (divwidth/2 - width/2)+"px", 'padding-top': (divheight/2 - height/2)+"px"});
        
        // notify the new zoom level
        $("#zoomdiv").html(Math.round((zoom*100))+"%");
        $("#zoomdiv").stop().clearQueue();
        $("#zoomdiv").show().fadeTo(10, 1);
        $("#zoomdiv").delay(500).fadeTo(500, 0, function() { $(this).hide(); });

}

function goTab(value)
{
    value -= 1;
    $("#tabs .tab").removeClass("active_tab");
    $($("#tabs .tab")[value]).addClass("active_tab");
    
    $("#sidebar .side_content").removeClass("active_side");
    $($("#sidebar .side_content")[value]).addClass("active_side");
}

function gridToggle()
{
    gridIsOn = !gridIsOn;
    draw();
}

function dismissContext()
{
    if ($(".context_menu").length == 1)
    {
        document.body.removeChild($(".context_menu")[0]);
        draw();
    }
}

function createChar(x, y)
{
    var newChar = {name: "Unnamed Character",
                    image: defaultImg,
                    prevKey: prevKey,
                    nextKey: nextKey,
                   sched: {}
                   };
    newChar.sched[time] = {type: "static", x: parseInt(x/16), y: parseInt(y/16)};
    
    map.chars.push(newChar);
    
    goTab(2);
}

function removeChar()
{
    
}

// returns whether or not a character exists at the given x y, 
// and if so returns that character
// if anyTime is false, the current time is used
function characterAt(cx, cy, anyTime)
{
    var returnme = null;
    
    cx = Math.floor(cx/16);
    cy = Math.floor(cy/16);
    
    var chars = map.chars;
    for (var x=0; x<chars.length; x++)
    {
        var pos;
        if (anyTime)
            pos = chars[x].sched[chars[x].prevKey(time)];
        else
            pos = chars[x].sched[time];
        
        if (!pos)
            continue;

        if (cx == pos.x && cy == pos.y)
            returnme = chars[x];
    }
    
    return returnme;
}

function canvasHighlight(x, y, size)
{
    context.strokeStyle = "#238df5";
    context.strokeWidth = "2";
    if (size == 16)
        context.strokeRect(Math.floor(x/16)*16, Math.floor(y/16)*16, 16, 16);
    else if (size == 5)
    {
        var point = pointAt(x, y);
        context.strokeRect(point.cx1-2.5, point.cy1-2.5, 5, 5);
    }
}

function insertKeyframe(char)
{
    var lastKey = char.prevKey(time);
    var pos = char.sched[lastKey];
    char.sched[time] = {type: "linear", x: pos.x, y: pos.y};
    draw();
}

function displayContextAt(x, y, px, py)
{
    dismissContext();
    var menu = document.createElement("div");
    $(menu).addClass("context_menu");
    
    var point = pointAt(x, y);
    
    if (point)
        // point was selected
        canvasHighlight(x, y, 5);
    else
      canvasHighlight(x, y, 16);
    
    if (point)
    {
        var elem = document.createElement("div");
        $(elem).addClass("context_elem");
        elem.innerHTML = "Add Point";
        elem.onclick = function(){ removeChar(char); };
        menu.appendChild(elem);
        
        if (point.type != "linear")
        {
            var elem = document.createElement("div");
            $(elem).addClass("context_elem");
            elem.innerHTML = "Make Linear";
            elem.onclick = function(){     point.type = "linear"; };
            menu.appendChild(elem);
        }
    }
    
    var char = characterAt(x, y, true);
    
    // if a character is here
    if (char)
    {
        // if a character is here at this time
        if (char.sched[time])
        {
            var count = Object.keys(char.sched).length;
            // if this is the only keyframe
            if (count == 1)
            {
                var elem = document.createElement("div");
                $(elem).addClass("context_elem");
                elem.innerHTML = "Remove Character";
                elem.onclick = function(){ removeChar(char); };
                menu.appendChild(elem);
            }
            else
            {
                var elem = document.createElement("div");
                $(elem).addClass("context_elem");
                elem.innerHTML = "Remove Keyframe";
    //            elem.onclick = function(){ removeKeyframe(char); };
                menu.appendChild(elem);
             }
        }
        else
        {
            var elem = document.createElement("div");
            $(elem).addClass("context_elem");
            elem.innerHTML = "Insert Keyframe";
            elem.onclick = function(){ insertKeyframe(char); };
            menu.appendChild(elem);
        }
    }
    else if (!point)
    {
        // do specific action based on x anad y coordinates in canvas
        var elem = document.createElement("div");
        $(elem).addClass("context_elem");
        elem.innerHTML = "Add Character";
        elem.onclick = function(){ createChar(x, y); };
        menu.appendChild(elem);

        elem = document.createElement("div");
        $(elem).addClass("context_elem");
        elem.innerHTML = "New Event";
    //    elem.onclick =  function(){ createEvent(x, y); };
        menu.appendChild(elem);

        elem = document.createElement("div");
        $(elem).addClass("context_elem");
        elem.innerHTML = "Create Warp";
    //    elem.onclick = create(x, y);
        menu.appendChild(elem);
    }
    
//    elem = document.createElement("div");
//    $(elem).addClass("context_elem");
//    elem.innerHTML = "Remove Character";
//    elem.onclick = removeChar(x, y);
//    menu.appendChild(elem);
    
    
    document.body.appendChild(menu);
    $(menu).css("margin-top", py);
    $(menu).css("margin-left", px);
}

function midPoint(x1, y1, x2, y2)
{
    return {x: (x1+x2)/2, y: (y1+y2)/2};
}

function prevKey(time)
{
    var lastKey = 0;
    var me = this.sched;
        
    for (var key in me) {
          if (parseInt(key) > parseInt(time))
              break;
          lastKey = key;
    }

    return lastKey;
}

function nextKey(time)
{
    var me = this.sched;
        
    for (var key in me) {
          if (parseInt(key) > parseInt(time))
              return key;
    }

    return 0;
}

function drawTweenedPosition(img, key1, pos, key2, npos)
{
    // the percent that the current key is along the path
    var percent =  (time - key1) / (key2 - key1);
    
    // if it has nowhere to go
    if ((pos.x == npos.x && pos.y == npos.y) || npos.type == "static")
        return;
    
    var nposx = npos.x*16;
    var nposy = npos.y*16;
    var posx = pos.x*16;
    var posy = pos.y*16;
    
    var newx, newy;
        
    if (npos.type == "linear")
    {
        newx = posx + (nposx - posx) * percent;
        newy = posy + (nposy - posy) * percent;
        
    }
    
    // http://jsfiddle.net/m1erickson/LumMX/
    
    if (npos.type == "quadratic")
    {
        newx = Math.pow(1-percent, 2) * posx + 2*(1-percent)*percent*npos.cx1 + Math.pow(percent, 2)* nposx;
        newy = Math.pow(1-percent, 2) * posy + 2*(1-percent)*percent*npos.cy1 + Math.pow(percent, 2)* nposy;

    }
    
    // draw the tween image at the calculated position
    context.drawImage(img, newx, newy);
}

function draw()
{
    // resizeCanvas
    resizeCanvas();
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw characters
    for (var x=0; x<map.chars.length; x++)
    {
        var me = map.chars[x];
        var key = me.prevKey(time);   
        var pos = me.sched[key];
        
        if (!pos)
            continue;
        
        var lastKey = me.prevKey(time-1);
        
        // a previous keyframe exists 
        if (lastKey != key && lastKey)
        {
            var past = me.sched[lastKey];
            // draw the last keyframe
            context.globalAlpha = 0.5;
            context.drawImage(me.image, past.x*16, past.y*16);
            context.globalAlpha = 1;
            
            context.beginPath();
            context.moveTo(past.x*16+8, past.y*16+8);
                        
            var midpoint = midPoint(past.x*16+8, past.y*16+8, pos.x*16+8, pos.y*16+8);
            
            // draw the path
            if (pos.type == "none" || (pos.x == past.x && pos.y == past.y))
            {
                
            }
            else if (pos.type == "linear")
            {
                pos.cx1 = midpoint.x;
                pos.cy1 = midpoint.y;
                context.fillRect(pos.cx1-2.5, pos.cy1-2.5, 5, 5);
                context.quadraticCurveTo(pos.cx1, pos.cy1, pos.x*16+8, pos.y*16+8);
//                context.lineTo(pos.x*16+8, pos.y*16+8);
            }
            else if (pos.type == "quadratic")
            {
                context.fillRect(pos.cx1-2.5, pos.cy1-2.5, 5, 5);
                context.quadraticCurveTo(pos.cx1, pos.cy1, pos.x*16+8, pos.y*16+8);
            }
            else if (pos.type == "bezier")
            {
                context.fillRect(pos.cx1-2.5, pos.cy1-2.5, 5, 5);
                context.fillRect(pos.cx2-2.5, pos.cy2-2.5, 5, 5);
                context.bezierCurveTo(pos.cx1, pos.cy1, pos.cx2, pos.cy2, pos.x*16+8, pos.y*16+8);
            }
            
            context.stroke();
        }

        if (key != time)
            context.globalAlpha = 0.5;
             
        context.drawImage(me.image, pos.x*16, pos.y*16);
        
        if (key != time)
        {
            context.globalAlpha = 1;
            var nKey = me.nextKey(time);
            
            if (nKey != 0)
                drawTweenedPosition(me.image, key, pos, nKey, me.sched[nKey]);
        }
    }
    
    if (gridIsOn)
        drawGrid();
//      var size = 10;
//      var p = [[188, 130], [140, 10], [300, 10], [388, 170]];
//
//      context.beginPath();
//      context.moveTo(p[0][0], p[0][1]);
//      context.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
//      context.lineWidth = 10;
//
//      // line color
//      context.strokeStyle = 'black';
//      context.stroke();
//
//      context.fillStyle = 'red';
//      context.fillRect(p[0][0], p[0][1], size, size);
//      context.fillRect(p[1][0], p[1][1], size, size);
//      context.fillRect(p[2][0], p[2][1], size, size);
//      context.fillRect(p[3][0], p[3][1], size, size);
}