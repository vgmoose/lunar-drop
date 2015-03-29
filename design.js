var counter = 0;

function loaded()
{
    $("#add").click(function() {
        $("#chars").append("<div style='border: 1px black solid; padding:10px;'><h3>Character "+counter+"</h3> Frames: <div style='border: 1px black solid; padding:10px; width:150px;'>X coor: <input style='width:40px' type='number'></input><br>Y coor: <input style='width:40px' type='number'></input><br>Time: <input type='time'><button>Add Keyframe</button></div></div>");
        counter ++;
    });
}
