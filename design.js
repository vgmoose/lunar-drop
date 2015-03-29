var counter = 0;

function loaded()
{
    $("#add").click(function() {
        $("#chars").append("<div style='border: 1px black solid; padding:10px;'><h3>Character "+counter+"</h3> Frames: <input type='time'><button>Add Keyframe</button></div>");
        counter ++;
    });
}
