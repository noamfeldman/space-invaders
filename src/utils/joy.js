/**
 * @desc A component that renders a joystick on a canvas.
 * @version 2.0.0
 * @author ©. Copyright 2018, 2019, 2020, 2021. All rights reserved.
 * @license All rights are reserved. You are not allowed to use this component for any purpose other than testing.
 * @see {@link https://github.com/bobboteck/JoyStick}
 * @
 * @param {string} container - The ID of the container element.
 * @param {object} parameters - The parameters for the joystick.
 * @param {function} callback - The callback function for the joystick.
 *
 * @returns {object} The joystick object.
 * @
 * @example
 * var joy = new JoyStick('joyDiv');
 *
 * @example
 * var joy = new JoyStick('joyDiv', {
 *   title: 'joystick',
 *   width: 200,
 *   height: 200,
 *   internalFillColor: '#00AA00',
 *   internalLineWidth: 2,
 *   internalStrokeColor: '#003300',
 *   externalLineWidth: 2,
 *   externalStrokeColor: '#008000',
 *   autoReturnToCenter: true
 * });
 *
 * @example
 * var joy = new JoyStick('joyDiv', {}, function(stickData) {
 *   console.log(stickData.xPosition);
 *   console.log(stickData.yPosition);
 *   console.log(stickData.cardinalDirection);
 *   console.log(stickData.x);
 *   console.log(stickData.y);
 * });
 *
 */
var JoyStick = function(container, parameters, callback) {
    parameters = parameters || {};
    var StickStatus = {};
    var title = (typeof parameters.title === "undefined" ? "joystick" : parameters.title),
        width = (typeof parameters.width === "undefined" ? 0 : parameters.width),
        height = (typeof parameters.height === "undefined" ? 0 : parameters.height),
        internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#00AA00" : parameters.internalFillColor),
        internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth),
        internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor),
        externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth),
        externalStrokeColor = (typeof parameters.externalStrokeColor === "undefined" ? "#008000" : parameters.externalStrokeColor),
        autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter);

    callback = callback || function(StickStatus) {};

    // Create Canvas element and add it in the Container object.
    var objContainer = (typeof container === "string") ? document.getElementById(container) : container;

    // Fixing Unable to preventDefault inside passive event listener due to target being treated as passive in Chrome [Thanks to https://github.com/artisticfox8 for this solution]
    if (objContainer) {
      objContainer.style.touchAction = "none";
    }

    var canvas = document.createElement("canvas");
    canvas.id = title;
    if (width === 0) {
        width = objContainer.clientWidth;
    }
    if (height === 0) {
        height = objContainer.clientHeight;
    }
    canvas.width = width;
    canvas.height = height;
    objContainer.appendChild(canvas);
    var context = canvas.getContext("2d");

    var pressed = 0; // Bool - 1=Yes - 0=No
    var circumference = 2 * Math.PI;
    var internalRadius = (canvas.width - ((canvas.width / 2) + 10)) / 2;
    var maxMoveStick = internalRadius + 5;
    var externalRadius = internalRadius + 30;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var directionHorizontal = 0; // -1=Left, 0=Center, 1=Right
    var directionVertical = 0; // -1=Up, 0=Center, 1=Down
    var stickX = centerX;
    var stickY = centerY;
    var movedX = centerX;
    var movedY = centerY;

    // Check if the device support the touch or not
    if ("ontouchstart" in document.documentElement) {
        canvas.addEventListener("touchstart", onTouchStart, false);
        document.addEventListener("touchmove", onTouchMove, false);
        document.addEventListener("touchend", onTouchEnd, false);
    } else {
        canvas.addEventListener("mousedown", onMouseDown, false);
        document.addEventListener("mousemove", onMouseMove, false);
        document.addEventListener("mouseup", onMouseUp, false);
    }
    // Draw the object
    drawExternal();
    drawInternal(centerX, centerY);
    /******************************************************
     * Private methods
     *****************************************************/
    /**
     * @desc Draw the external circle of the joystick
     */
    function drawExternal() {
        context.beginPath();
        context.arc(centerX, centerY, externalRadius, 0, circumference, false);
        context.lineWidth = externalLineWidth;
        context.strokeStyle = externalStrokeColor;
        context.stroke();
    }
    /**
     * @desc Draw the internal circle of the joystick
     */
    function drawInternal() {
        context.beginPath();
        if (movedX < internalRadius) {
            movedX = maxMoveStick;
        }
        if ((movedX + internalRadius) > canvas.width) {
            movedX = canvas.width - (maxMoveStick);
        }
        if (movedY < internalRadius) {
            movedY = maxMoveStick;
        }
        if ((movedY + internalRadius) > canvas.height) {
            movedY = canvas.height - (maxMoveStick);
        }
        context.arc(movedX, movedY, internalRadius, 0, circumference, false);
        // create radial gradient
        var grd = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 200);
        // Light color
        grd.addColorStop(0, internalFillColor);
        // Dark color
        grd.addColorStop(1, internalStrokeColor);
        context.fillStyle = grd;
        context.fill();
        context.lineWidth = internalLineWidth;
        context.strokeStyle = internalStrokeColor;
        context.stroke();
    }
    /**
     * @desc Events for manage touch
     */
    function onTouchStart(event) {
        pressed = 1;
        stickX = event.changedTouches[0].pageX;
        stickY = event.changedTouches[0].pageY;
    }

    function onTouchMove(event) {
        if (pressed === 1) {
            movedX = event.changedTouches[0].pageX;
            movedY = event.changedTouches[0].pageY;
            // Manage offset
            if (canvas.offsetParent.tagName.toUpperCase() === "BODY") {
                movedX -= canvas.offsetLeft;
                movedY -= canvas.offsetTop;
            } else {
                movedX -= canvas.offsetParent.offsetLeft;
                movedY -= canvas.offsetParent.offsetTop;
            }
            // Delete canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Redraw object
            drawExternal();
            drawInternal();

            // Set attribute of callback
            StickStatus.xPosition = movedX;
            StickStatus.yPosition = movedY;
            StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
            StickStatus.y = ((100 * ((movedY - centerY) / maxMoveStick)) * -1).toFixed();
            StickStatus.cardinalDirection = getCardinalDirection();
            callback(StickStatus);
        }
    }

    function onTouchEnd() {
        pressed = 0;
        // If required reset position store variable
        if (autoReturnToCenter) {
            movedX = centerX;
            movedY = centerY;
        }
        // Delete canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw object
        drawExternal();
        drawInternal();

        // Set attribute of callback
        StickStatus.xPosition = movedX;
        StickStatus.yPosition = movedY;
        StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
        StickStatus.y = ((100 * ((movedY - centerY) / maxMoveStick)) * -1).toFixed();
        StickStatus.cardinalDirection = getCardinalDirection();
        callback(StickStatus);
    }
    /**
     * @desc Events for manage mouse
     */
    function onMouseDown(event) {
        pressed = 1;
        stickX = event.pageX;
        stickY = event.pageY;
    }

    function onMouseMove(event) {
        if (pressed === 1) {
            movedX = event.pageX;
            movedY = event.pageY;
            // Manage offset
            if (canvas.offsetParent.tagName.toUpperCase() === "BODY") {
                movedX -= canvas.offsetLeft;
                movedY -= canvas.offsetTop;
            } else {
                movedX -= canvas.offsetParent.offsetLeft;
                movedY -= canvas.offsetParent.offsetTop;
            }
            // Delete canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Redraw object
            drawExternal();
            drawInternal();

            // Set attribute of callback
            StickStatus.xPosition = movedX;
            StickStatus.yPosition = movedY;
            StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
            StickStatus.y = ((100 * ((movedY - centerY) / maxMoveStick)) * -1).toFixed();
            StickStatus.cardinalDirection = getCardinalDirection();
            callback(StickStatus);
        }
    }

    function onMouseUp() {
        pressed = 0;
        // If required reset position store variable
        if (autoReturnToCenter) {
            movedX = centerX;
            movedY = centerY;
        }
        // Delete canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw object
        drawExternal();
        drawInternal();

        // Set attribute of callback
        StickStatus.xPosition = movedX;
        StickStatus.yPosition = movedY;
        StickStatus.x = (100 * ((movedX - centerX) / maxMoveStick)).toFixed();
        StickStatus.y = ((100 * ((movedY - centerY) / maxMoveStick)) * -1).toFixed();
        StickStatus.cardinalDirection = getCardinalDirection();
        callback(StickStatus);
    }
    /**
     * @desc Get the cardinal direction of the joystick
     * @return {String} The cardinal direction of the joystick (N, NE, E, SE, S, SW, W, NW)
     */
    function getCardinalDirection() {
        var result = "";
        var horizontal = movedX - centerX;
        var vertical = movedY - centerY;

        if (vertical >= -10 && vertical <= 10) {
            result = "C";
        }
        if (vertical < -10) {
            result = "N";
        }
        if (vertical > 10) {
            result = "S";
        }

        if (horizontal < -10) {
            if (result === "C") {
                result = "W";
            } else {
                result += "W";
            }
        }
        if (horizontal > 10) {
            if (result === "C") {
                result = "E";
            } else {
                result += "E";
            }
        }

        return result;
    }

    /******************************************************
     * Public methods
     *****************************************************/

    /**
     * @desc Destroy the joystick instance and remove event listeners
     */
    this.destroy = function () {
        if ("ontouchstart" in document.documentElement) {
            canvas.removeEventListener("touchstart", onTouchStart, false);
            document.removeEventListener("touchmove", onTouchMove, false);
            document.removeEventListener("touchend", onTouchEnd, false);
        } else {
            canvas.removeEventListener("mousedown", onMouseDown, false);
            document.removeEventListener("mousemove", onMouseMove, false);
            document.removeEventListener("mouseup", onMouseUp, false);
        }

        if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    };
};

export default JoyStick; 