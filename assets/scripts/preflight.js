// Specify the hostname of the conference node, e.g. conf1.pextest.com
var conferenceNode = 'conf1.pextest.com';

// Instantiate PexRTC
var pexRTC = new PexRTC();

// Important! You must have a valid SSL cert for device selection to work!!
// Set the constraints of the video to search for
// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
let constraints = {
  video: {
    height: {
      min: 1080,
    },
    width: {
      min: 1920,
    },
  },
  audio: true,
};

// An async function to get the video and audio devices
async function getMediaDevices(constraints) {
  // Request permission to list devices
  await navigator.mediaDevices.getUserMedia(constraints);
  // Enumerate the devices
  let devices = await navigator.mediaDevices.enumerateDevices();

  // Filter only video devices
  let video_devices = devices.filter((d) => d.kind === 'videoinput');
  // Filter only audio devices
  let audio_devices = devices.filter((d) => d.kind === 'audioinput');

  // Set the Video Devices so we can show on the UI
  addDevicesToDropDown(
    'videoDevices',
    video_devices,
    localStorage.getItem('videoDeviceId')
  );
  // Set the Audio Devices so we can show on the UI
  addDevicesToDropDown(
    'audioDevices',
    audio_devices,
    localStorage.getItem('audioDeviceId')
  );
}

// Run the async function
getMediaDevices(constraints);

// This method is used to add devices to the device selection box
function addDevicesToDropDown(parent, devices, defaultVal = '') {
  // Track the count of devices, for labelling only
  let deviceCount = 0;

  // Get an array of elements from the passed parent class name
  let selectors = document.getElementsByClassName(parent);

  // Iterate through all elements
  for (let selector of selectors) {
    // Clear the elements content
    selector.innerHTML = '';

    // Iterate through the devices
    for (let device of devices) {
      // Iterate the count of devices
      deviceCount++;

      // Get the device ID
      let deviceId = device.deviceId;
      // Create the label for the device
      let deviceLabel = device.label
        ? device.label
        : `Device ${deviceCount} (${deviceId.substring(deviceId.length - 8)})`;

      // Create an option for the select dropdown with the device label and device ID
      let deviceOption = new Option(deviceLabel, deviceId);
      // Append the option to the select dropdown
      selector.append(deviceOption);
    }

    // Set the select dropdown to the default value
    selector.value = defaultVal;
  }
}

// This method is used to select the audio and video devices
function selectDevices(videoDeviceId, audioDeviceId) {
  // If a video device has been selected
  if (videoDeviceId !== 'loading') {
    // Set the video device to the ID from our video dropdown
    pexRTC.video_source = videoDeviceId;
    // Save the video device to local storage for recall later
    localStorage.setItem('videoDeviceId', videoDeviceId);
  }

  // If an audio device has been selected
  if (audioDeviceId !== 'loading') {
    // Set the audio device to the ID from our audio dropdown
    pexRTC.audio_device = audioDeviceId;
    // Save the audio device to local storage for recall later
    localStorage.setItem('audioDeviceId', audioDeviceId);
  }

  // Call the syncDevices method to update all elements with the selected video device
  syncDevices('videoDevices', localStorage.getItem('videoDeviceId'));
  // Call the syncDevices method to update all elements with the selected audio device
  syncDevices('audioDevices', localStorage.getItem('audioDeviceId'));

  // Renegotiate the media
  // The video will flicker momentarily 
  pexRTC.renegotiate(false);
}

// This method ensures that all device selector boxes have the same device selected
function syncDevices(parent, defaultVal = '') {
  // Get the elements by their class name
  let selectors = document.getElementsByClassName(parent);

  // For each element
  for (let selector of selectors) {
    // Select the device
    selector.value = defaultVal;
  }
}

// This method is called on button push to connect our call
function connectCall() {
  // Find the first selected video device, as they are sync'd we can just use the first found element
  let videoDevice = document.getElementsByClassName('videoDevices')[0];
  // Get the device ID from the selector element
  let videoDeviceId = videoDevice.options[videoDevice.selectedIndex].value;

  // Find the first selected audio device, as they are sync'd we can just use the first found element
  let audioDevice = document.getElementsByClassName('audioDevices')[0];
  // Get the device ID from the selector element
  let audioDeviceId = audioDevice.options[audioDevice.selectedIndex].value;

  // Get the dial URI from the text box in the preflight
  let dialURI = document.getElementById('dialURI').value;
  // Get the participant name from the text box in the preflight
  let participantName = document.getElementById('participantName').value;

  // Select the correct video and audio devices in PexRTC
  selectDevices(videoDeviceId, audioDeviceId);

  // Check that the values are defined
  if (dialURI && participantName) {
    // Make the actual call with the pexRTC Library
    // The first parameter should be changed to your conference nodes name
    pexRTC.makeCall(conferenceNode, dialURI, participantName);
  } else {
    // Something was not entered correctly, inform the user
    alert('You must specify a name and a dial URI');
  }
}
