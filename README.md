# Lunar Drop
Lunar Drop is a game engine tool that produces ```.ld``` files which aid in the development of a game where characters and events are synced with a clock. 

## Designer
The Lunar Drop designer is written in Javascript and can be viewed locally in the browser or [here](http://vgmoose.github.io/lunar-drop). The main interface is inspired by tools such as [AdvanceMap](http://ampage.no-ip.info/index.php?seite=home). It allows a "timeline" view of the entire map that is currently being edited.

![main interface](http://i.imgur.com/ZT3Pduj.png)

### How to Use
The designer works similar to that of an animation tool. Characters and events can be added at specific times, and then, by adjusting the time slider at the bottom or in the bottom left, keyframes can be inserted for each character and their paths, movements, and scripts managed throughout different times during the day. This allows for an overworld to be mapped out with several different individual characters moving around that are all synced with the in-game clock.

#### Adding a Character
A character can be added by right clicking any tile on the main canvas and choosing "Add Character".

![add a character](http://i.imgur.com/35vb7O4.png) results in ![added a character](http://i.imgur.com/pdabrBq.png)

The character can then be dragged around by clicking and dragging it to any other position on the grid.

#### Creating Movement
Adjust the time in the bottom left of the screen to a future time from where the character has been inserted. The character will fade out as you move into the future. Right click the faded character and choose "Insert Keyframe"

![insert keyframe](http://i.imgur.com/Ysjg34Y.png) results in ![added a keyframe](http://i.imgur.com/qQ0kZGo.png)

After adding the keyframe, drag the new character. A linear tween path will automatically be created. By grabbing the midpoint of the path, it can be adjusted into a quadratic tween.

![linear tween path](http://i.imgur.com/OZBzCBD.png) grab midpoint and drag: ![quadratic](http://i.imgur.com/CbWfRDz.png)

#### Zooming
The canvas can be zoomed in or out by clicking on the zoom buttons at the top of the screen in the tool bar, by making a pinching gesture in Chrome, or by holding control and using the mousewheel.

#### Properties
The tabs on the left of the screen adjust various aspects of the map, including height and with, the step interval for the time slider, the name of the map, and the background image the map uses.
