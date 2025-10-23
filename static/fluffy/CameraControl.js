document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.getElementById("videoElement");

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      videoElement.srcObject = stream;
      videoElement.play();
    })
    .catch(function (error) {
      console.error("カメラにアクセスできませんでした: ", error);
    });

  const placeholderImage = document.getElementById("placeholderImage");
  window.toggleCamera = function (isCameraOn) {
    if (isCameraOn) {
      videoElement.style.display = "block";
      placeholderImage.style.display = "none";
    } else {
      videoElement.style.display = "none";
      placeholderImage.style.display = "block";
    }
  };
  toggleCamera(false); // Initialize with the camera off
});
