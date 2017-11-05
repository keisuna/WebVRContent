var HMD;
var frameData;
var mode = 1;
var button;
var height;
var width;
function getVRDevices() {
    if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(function (devices) {
            for (var i = 0; i < devices.length; i++) {
                if (devices[i] != null) {
                    HMD = devices[i];
                    console.log("get HMD device");
                    console.log(HMD.displayName);
                    button = document.getElementById('button');
                    button.disabled = false;
                    break;
                }
            }
        });
    }
}
function webvr_click() {
    console.log("change mode");
    if (!HMD) {
        alert("Can't find HMD display");
        return;
    }
    gameInstance.SendMessage('CameraSet', 'ChangeMode', mode);
    if (mode == 1) {
        StartVR();
        mode = 0;
        button.value = "Stop VR";
    }
    else {
        StopVR();
        mode = 1;
        button.value = "Start VR";
    }
}
function StartVR() {
    frameData = new VRFrameData();
    myCanvas = document.getElementById('#canvas');
    console.log(HMD);
    HMD.requestPresent([{ source: myCanvas }]).then(function () {
        console.log('Presenting to WebVR display');

        var leftEye = HMD.getEyeParameters('left');
        var rightEye = HMD.getEyeParameters('right');
        width = myCanvas.width;
        height = myCanvas.height;
        myCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
        myCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
        getVRSensorState();
    });
}
function StopVR() {
    myCanvas = document.getElementById('#canvas');
    console.log(HMD);
    HMD.exitPresent().then(function () {
        console.log('stop WebVR display');
        myCanvas.width = width;
        myCanvas.height = height;
        HMD.cancelAnimationFrame(getVRSensorState);
    });
}
function getVRSensorState() {

    HMD.requestAnimationFrame(getVRSensorState);
    HMD.getFrameData(frameData);
    var curFramePose = frameData.pose;

    var orientation = curFramePose.orientation;
    if (orientation != null) {
        gameInstance.SendMessage('CameraSet', 'RotationX', -orientation[0]);
        gameInstance.SendMessage('CameraSet', 'RotationY', -orientation[1]);
        gameInstance.SendMessage('CameraSet', 'RotationZ', orientation[2]);
        gameInstance.SendMessage('CameraSet', 'RotationW', orientation[3]);
    }
    var position = curFramePose.position;
    if (position != null) {
        gameInstance.SendMessage('CameraSet', 'PositionX', position[0]);
        gameInstance.SendMessage('CameraSet', 'PositionY', position[1]);
        gameInstance.SendMessage('CameraSet', 'PositionZ', -position[2]);
    }
    ControllerUpdate();
}
function Render() {
    HMD.submitFrame();
}