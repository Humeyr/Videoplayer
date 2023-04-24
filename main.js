const container = document.querySelector(".container");
mainVideo = container.querySelector(".video");
videoTimeline = container.querySelector(".video-timeline");
progressBar = container.querySelector(".progress-bar");
volumeBtn = container.querySelector(".volume i");
volumeSlider = container.querySelector(".left input");
currentVidTime = container.querySelector(".current-time");
videoDuration = container.querySelector(".video-duration");
skipBackward = container.querySelector(".skip-backward i");
skipForward = container.querySelector(".skip-forward i");
playPauseBtn = container.querySelector(".play-pause i");
speedBtn = container.querySelector(".playback-speed span");
speedOptions = container.querySelector(".speed-options");
picInPicBtn = container.querySelector(".pic-in-pic span");
fullscreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
  if (mainVideo.paused) return; // if video is paused return
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 3000);
};

hideControls();

container.addEventListener("mousemove", () => {
  container.classList.add("show-controls");
  clearTimeout(timer); // clear timer
  hideControls(); // calling hideControls
});

const formatTime = (time) => {
  // getting seconds, minutes, hours
  let seconds = Math.floor(time % 60);
  minutes = Math.floor(time / 60) % 60;
  hours = Math.floor(time / 3600);

  // adding 0 at the beginning, if the particular value is less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target; // getting currentTime & duration of the video
  let percent = (currentTime / duration) * 100; // getting percent
  progressBar.style.width = `${percent}%`; // passing percent as progressbar width
  //   console.log(currentTime, duration);
  currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", (e) => {
  videoDuration.innerText = formatTime(e.target.duration); // passing video duration as videoDuration innerText
});

videoTimeline.addEventListener("click", (e) => {
  let timelineWidth = e.target.clientWidth; // getting videoTimeLine width
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
});

const draggableProgressBar = (e) => {
  let timelineWidth = e.target.clientWidth; // getting videoTimeline width
  progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressbard width
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
  currentVidTime.innerText = formatTime(mainVideo.currentTime); // passing video current time as currentVidTime innerText
};

videoTimeline.addEventListener("mousedown", () => {
  // calling draggableProgress function on mousemove event
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", () => {
  // removing mousemove listener on mouseup event
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  let offsetX = e.offsetX; // getting mouseX position
  progressTime.style.left = `${offsetX}px`; // passing offsetX value as progressTime left value
  let timelineWidth = e.target.clientWidth; // getting videoTimeline width
  let percent = (e.offsetX / timelineWidth) * mainVideo.duration; // getting percent
  progressTime.innerText = formatTime(percent); // passing percent as progressTime innerText
});

volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    // if volume icon isn't volume high icon
    mainVideo.volume = 0.5; // passing 0.5 value as video volume
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0.0; // passing 0.0 value as video volume, so the video mute
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = mainVideo.volume; // update slider value according to the video volume
});

volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value; // passing slider value as video volume
  //   console.log(mainVideo.volume);
  //   console.dir(e.target);
  if (e.target.value == 0) {
    // if slider value is 0, change icon to mute icon
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show"); // toggle show class
});

speedOptions.querySelectorAll("li").forEach((option) => {
  //   console.log(option); // getting all options
  option.addEventListener("click", () => {
    // adding click evenet on all speed option
    mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
    speedOptions.querySelector(".active").classList.remove("active"); // removing active class
    option.classList.add("active"); // adding active class on the selected option
  });
});

document.addEventListener("click", (e) => {
  // hide speed options on document click
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-rounded"
  ) {
    speedOptions.classList.remove("show");
  }
});

picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture(); // changing video mode to pciture in picture
});

fullscreenBtn.addEventListener("click", () => {
  container.classList.toggle("fullscreen");
  if (document.fullscreenElement) {
    // if video is already in fullscreen mode
    fullscreenBtn.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen(); // exit from fullscreen mode and return
  }
  fullscreenBtn.classList.replace("fa-expand", "fa-compress");
  container.requestFullscreen(); // go to fullscreen mode
});

skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 5; // subract 5 seconds from the current video time
});

skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 5; // add 5 seconds to the current video time
});

playPauseBtn.addEventListener("click", () => {
  //if video is paused, play the video else pause the video
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
  // if video is play, change icon to pause
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  // if video is pause, change icon to play
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});