// Register Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js")
        .then((regiter) => {
            console.log("Registered Successfylly => ", regiter);
        })
        .catch((err) => console.log(err));
} else {
    console.log("Not Support");
}
// End of Register Service Worker

// Dom Manipulation

const showNotifBtn = document.querySelector(".show-notif");
const videoElem = document.querySelector(".video");
const canvasElem = document.querySelector(".canvas");
const takePhotoElem = document.querySelector(".take-photo");

const notificationPermissionState = async () => {
  if (navigator.permissions) {
    let result = await navigator.permissions.query({ name: "notifications" });
    return result.state;
  }
};

const showNotification = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((sw) => {
      sw.showNotification("Notification Title (SW)", {
        body: "Notification Body :))",
        dir: "ltr",
        vibrate: [100, 50, 200],
        icon: "./assets/images/post01.png",
        badge: "./assets/images/post02.png",
        image: "./assets/images/pwa.jpeg",
        tag: "test-notification",
        actions: [
          { action: "confirm", title: "Accept" },
          { action: "cancel", title: "Cancel" },
        ],
      });
    });
  }
};

const getNotificationPermission = async () => {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      showNotification();
      console.log("دسترسی داده شد");
    } else if (result === "denied") {
      console.log("دسترسی داده نشد");
    }
  });
};


const getMediaPermission = () => {
  if ("getUserMedia" in navigator) {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => (videoElem.srcObject = stream))
      .catch((err) => console.log("Stream Error =>", err));
  } else {
    alert("مرورگر شما از قابلیت استریم پشتیبانی نمی‌کند");
  }
};

const takePhoto = () => {
  const context = canvasElem.getContext("2d");
  canvasElem.style.display = "block";
  videoElem.style.display = "none";
  takePhotoElem.style.display = "none";
  context.drawImage(videoElem, 0, 0, canvasElem.width, 525);

  videoElem.srcObject.getVideoTracks().forEach((track) => track.stop());
};

const hasVideoDevice = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  let hasDevice = false;
  devices.forEach((device) => {
    if (device.kind === "videoinput") {
      hasDevice = true;
    }
  });

  return hasDevice;
};

  
showNotifBtn.addEventListener("click", getNotificationPermission);
takePhotoElem.addEventListener("click", takePhoto);


window.addEventListener("load", async () => {
  const hasDevice = await hasVideoDevice();
  if (hasDevice) {
    getMediaPermission();
  }
});
