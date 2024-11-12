// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var positionX = 0.6; // Default horizontal position
    var positionY = 0.5; // Default vertical position (relative to video height)
    var vidWidth = vid.videoWidth / 2;
    var vidHeight = vid.videoHeight;

    var mergeContext = videoMerge.getContext("2d");

    if (vid.readyState > 3) {
        vid.play();

        function trackLocation(e) {
            // Get bounding box of the canvas
            var bcr = videoMerge.getBoundingClientRect();

            // Normalize mouse position to [0, 1] relative to canvas
            positionX = ((e.clientX - bcr.left) / bcr.width).clamp(0.0, 1.0);
            positionY = ((e.clientY - bcr.top) / bcr.height).clamp(0.0, 1.0);
        }

        function trackLocationTouch(e) {
            var bcr = videoMerge.getBoundingClientRect();
            positionX = ((e.touches[0].clientX - bcr.left) / bcr.width).clamp(0.0, 1.0);
            positionY = ((e.touches[0].clientY - bcr.top) / bcr.height).clamp(0.0, 1.0);
        }

        videoMerge.addEventListener("mousemove", trackLocation, false);
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove", trackLocationTouch, false);

        function drawLoop() {
            mergeContext.clearRect(0, 0, videoMerge.width, videoMerge.height); // Clear canvas

            // Draw left video
            mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
            var colStart = (vidWidth * positionX).clamp(0.0, vidWidth);
            var colWidth = (vidWidth - (vidWidth * positionX)).clamp(0.0, vidWidth);

            // Draw right video
            mergeContext.drawImage(vid, colStart + vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);

            // Calculate arrow and circle positions
            var arrowLength = 0.09 * vidHeight;
            var arrowheadWidth = 0.025 * vidHeight;
            var arrowheadLength = 0.04 * vidHeight;
            var arrowWidth = 0.007 * vidHeight;
            var currX = vidWidth * positionX;
            var currY = vidHeight * positionY;

            // Draw circle
            mergeContext.beginPath();
            mergeContext.arc(currX, currY, arrowLength * 0.7, 0, Math.PI * 2, false);
            mergeContext.fillStyle = "#FFD79340";
            mergeContext.fill();

            // Draw border
            mergeContext.beginPath();
            mergeContext.moveTo(currX, 0);
            mergeContext.lineTo(currX, vidHeight);
            mergeContext.closePath();
            mergeContext.strokeStyle = "#444444";
            mergeContext.lineWidth = 5;
            mergeContext.stroke();

            // Draw arrow
            mergeContext.beginPath();
            mergeContext.moveTo(currX, currY - arrowWidth / 2);
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, currY - arrowWidth / 2);
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, currY - arrowheadWidth / 2);
            mergeContext.lineTo(currX + arrowLength / 2, currY);
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, currY + arrowheadWidth / 2);
            mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, currY + arrowWidth / 2);
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, currY + arrowWidth / 2);
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, currY + arrowheadWidth / 2);
            mergeContext.lineTo(currX - arrowLength / 2, currY);
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, currY - arrowheadWidth / 2);
            mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, currY - arrowWidth / 2);
            mergeContext.closePath();
            mergeContext.fillStyle = "#444444";
            mergeContext.fill();

            requestAnimationFrame(drawLoop);
        }

        requestAnimationFrame(drawLoop);
    }
}

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
}

function resizeAndPlay(element) {
    var cv = document.getElementById(element.id + "Merge");
    cv.width = element.videoWidth / 2;
    cv.height = element.videoHeight;
    element.play();
    element.style.height = "0px"; // Hide video without stopping it

    playVids(element.id);
}