var zoom = 1;
var canvas;
var context;

$(document).ready(function(){
    $("#timeslide").on("input", function(){
        $("#timebox").val(convertMinutesToTime($(this).val()));
    });
    $("#timebox").on("input", function(){
        console.log(convertTimeToMinutes($(this).val()));
        $("#timeslide").val(convertTimeToMinutes($(this).val()));
    });
    
    $("#timebox").val("06:00");
    
    $("body").on("mousewheel", function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if(e.originalEvent.wheelDelta /120 > 0) {
            zoom += 0.1;
        }
        else{
            zoom -= 0.1;
        }
        
        performZoom();

    }
        
});

            draw();
});

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
    for (var x=0.5; x<canvas.width; x+=16)
    {
        
        context.strokeStyle = "#aaa";
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
        
        if (zoom > 4)
            zoom = 4;
                
        var width = zoom*canvas.width;
        var height = zoom*canvas.height;
        $('#main').css({'width': width+"px", 'height': height+"px"});
        
        // notify the new zoom level
        $("#zoomdiv").html(Math.round((zoom*100))+"%");
        $("#zoomdiv").stop().clearQueue();
        $("#zoomdiv").fadeTo(10, 1);
        $("#zoomdiv").delay(500).fadeTo(500, 0);
}

function draw()
{
      canvas = document.getElementById('main');
      context = canvas.getContext('2d');
    
    context.webkitImageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false; /// future

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