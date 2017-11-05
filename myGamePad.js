var IdR = 0;
var IdL = 1;
var appeard = [false, false];
function ControllerUpdate() {
    var RController = GetGamePads(IdR);
    if (RController != null) {
        GetGamePadPose(RController, IdR);
        GetGamePadButton(RController, IdR);
    } else {
        if (appeard[IdR]) {
            console.log("right controller disappeard");
            gameInstance.SendMessage('RightController', 'Undefined', IdR);
            appeard[IdR] = false;
        }
    }
    var LController = GetGamePads(IdL);
    if (LController != null) {
        GetGamePadPose(LController, IdL);
        GetGamePadButton(LController, IdL);
    } else {
        if (appeard[IdL]) {
            console.log("left controller disappeard");
            gameInstance.SendMessage('LeftController', 'Undefined', IdL);
            appeard[IdL] = false;
        }
    }
}

function GetGamePads(index) {
    if(navigator.getGamepads){
        var gamepads = navigator.getGamepads();
        var id = 0;
        for (var i = 0; i < gamepads.length; i++) {
            var gamepad = gamepads[i];
            if (gamepad && gamepad.id == 'OpenVR Gamepad') {
                if (id == index) return gamepad;
                if (id == index) return gamepad;
                id++;
            }
        }
    }
    return null;
}

function GetGamePadPose(gamepad, index) {
    var side = '';
    if (index == IdR) side = 'RightController';
    else side = 'LeftController';

    var pose = gamepad.pose;
    var orientation = pose.orientation;
    if (orientation != null) {
        gameInstance.SendMessage(side, 'RotationX', -orientation[0]);
        gameInstance.SendMessage(side, 'RotationY', -orientation[1]);
        gameInstance.SendMessage(side, 'RotationZ', orientation[2]);
        gameInstance.SendMessage(side, 'RotationW', orientation[3]);
    }

    var position = pose.position;
    if (position != null) {
        gameInstance.SendMessage(side, 'PositionX', position[0]);
        gameInstance.SendMessage(side, 'PositionY', position[1]);
        gameInstance.SendMessage(side, 'PositionZ', -position[2]);
    }
    if (!appeard[index]) {
        console.log(side + " appeard");
        appeard[index] = true;
        gameInstance.SendMessage(side, 'DisplayController');
    }
}

var ButtonArray = [[false, false, false, false],
                   [false, false, false, false]];
function GetGamePadButton(gamepad, index) {
    var side = '';
    if (index == IdR) side = 'RightController';
    else side = 'LeftController';
    for (var i = 0; i < 4; i++) {
        if (gamepad.buttons[i].pressed != ButtonArray[index][i]) {
            ButtonArray[index][i] = gamepad.buttons[i].pressed;
            if (ButtonArray[index][i] == true) OnButtonEnter(side, i);
            else OnButtonExit(side, i);
        } else {
            if (gamepad.buttons[i].pressed == true) OnButtonStay(side, i);
        }
    }
    if (gamepad.axes != null) {
        gameInstance.SendMessage(side, 'AxisX', gamepad.axes[0]);
        gameInstance.SendMessage(side, 'AxisY', gamepad.axes[1]);
    }
}
function OnButtonEnter(side, buttonindex) {
    gameInstance.SendMessage(side, 'ButtonEnter', buttonindex);
}
function OnButtonExit(side, buttonindex) {
    gameInstance.SendMessage(side, 'ButtonExit', buttonindex);
}
function OnButtonStay(side, buttonindex) {
    gameInstance.SendMessage(side, 'ButtonStay', buttonindex);
}
