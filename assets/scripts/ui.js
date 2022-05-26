var preflightContainer = document.getElementById('preflightContainer');
var callContainer = document.getElementById('callContainer');
var callPinRequestContainer = document.getElementById(
  'callPinRequestContainer'
);
var callSelfviewContainer = document.getElementById('callSelfviewContainer');
var settingsContainer = document.getElementById('settingsContainer');
var callPinTitle = document.getElementById('callPinTitle');
var micMute = document.getElementById('micMute');
var vidMute = document.getElementById('vidMute');

function navigateToPreflight() {
  preflightContainer.style.display = 'flex';
  callContainer.style.display = 'none';
  callSelfviewContainer.style.display = 'none';

  hideSettings();
}

function navigateToCall() {
  preflightContainer.style.display = 'none';
  callContainer.style.display = 'flex';
  callSelfviewContainer.style.display = 'flex';
}

function showPinPopup() {
  callPinRequestContainer.style.display = 'flex';
}

function hidePinPopup() {
  callPinRequestContainer.style.display = 'none';
}

function updateMicMuteState(micState) {
  micMute.classList.remove(micState ? 'fa-microphone' : 'fa-microphone-slash');
  micMute.classList.add(!micState ? 'fa-microphone' : 'fa-microphone-slash');
}

function updateVideoMuteState(vidState) {
  vidMute.classList.remove(vidState ? 'fa-video' : 'fa-video-slash');
  vidMute.classList.add(!vidState ? 'fa-video' : 'fa-video-slash');
}

function showSettings() {
  settingsContainer.style.display = 'flex';
}

function hideSettings() {
  settingsContainer.style.display = 'none';
}

function closeSettings() {
  hideSettings();
}
