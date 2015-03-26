var zoom = 1;
var canvas;
var context;
var gridIsOn = true;

var map = {width: 44, height: 32};

$(document).ready(function(){
    $("#timeslide").on("input", function(){
        $("#timebox").val(convertMinutesToTime($(this).val()));
    });
    $("#timebox").on("input", function(){
        console.log(convertTimeToMinutes($(this).val()));
        $("#timeslide").val(convertTimeToMinutes($(this).val()));
    });
    
    $("#timebox").val("06:00");
    
    canvas = document.getElementById('main');
    context = canvas.getContext('2d');
    
    $(canvas).on('contextmenu', function(e) {
        displayContextAt(parseInt(e.offsetX/zoom), parseInt(e.offsetY/zoom), e.pageX, e.pageY);
        e.preventDefault();
    }); 
    
    $("body").on("mousedown", function(e) {
        dismissContext();
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
    
        context.imageSmoothingEnabled = false; /// future

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

function createChar()
{
    
}

function removeChar()
{
    
}

function canvasHighlight(x, y)
{
    context.strokeStyle = "#238df5";
    context.strokeWidth = "2";
    context.strokeRect(Math.floor(x/16)*16, Math.floor(y/16)*16, 16, 16);
}

function displayContextAt(x, y, px, py)
{
    dismissContext();
    var menu = document.createElement("div");
    $(menu).addClass("context_menu");
    
    canvasHighlight(x, y);
    
    // do specific action based on x anad y coordinates in canvas
    var elem = document.createElement("div");
    $(elem).addClass("context_elem");
    elem.innerHTML = "Create Character";
    elem.onclick = createChar(x, y);
    menu.appendChild(elem);
    
    elem = document.createElement("div");
    $(elem).addClass("context_elem");
    elem.innerHTML = "Remove Character";
    elem.onclick = removeChar(x, y);
    menu.appendChild(elem);
    
    
    document.body.appendChild(menu);
    $(menu).css("margin-top", py);
    $(menu).css("margin-left", px);
}

function draw()
{
    // resizeCanvas
    resizeCanvas();
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
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