$(document).ready(function(){
    $("#timeslide").on("input", function(){
        $("#timebox").val(convertMinutesToTime($(this).val()));
    });
    $("#timebox").on("input", function(){
        console.log(convertTimeToMinutes($(this).val()));
        $("#timeslide").val(convertTimeToMinutes($(this).val()));
    });
    
    $("#timebox").val("06:00");

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