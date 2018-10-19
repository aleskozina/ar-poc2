// let constraints = null;
// if (typeof window.ontouchstart === 'undefined') {
//     constraints = {audio: false, video: { facingMode: 'user' }};
// } else {
//     constraints = {audio: false, video: { facingMode: { exact: "environment" }}};
// }

// navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//     const video = document.querySelector('video');
//     const videoTracks = stream.getVideoTracks();

//     console.log('Got stream with constraints:', constraints);
//     console.log(`Using video device: ${videoTracks[0].label}`);

//     window.stream = stream; // make variable available to browser console
//     video.srcObject = stream;


// });

const throttle = function(fn, timeoutDuration = 400) {

    let timeoutId = null;

    return (...args) => {

        if (timeoutId === null) {
            timeoutId = setTimeout(() => {
                fn(...args);
                timeoutId = null;
            }, timeoutDuration)
        }
    }
}

const write = function(attr, value) {
    document.querySelector(`.${attr}`).innerHTML = value;
}

const compassHeading = function(alpha, beta, gamma) {
    // Convert degrees to radians
  var alphaRad = alpha * (Math.PI / 180);
  var betaRad = beta * (Math.PI / 180);
  var gammaRad = gamma * (Math.PI / 180);

  // Calculate equation components
  var cA = Math.cos(alphaRad);
  var sA = Math.sin(alphaRad);
  var cB = Math.cos(betaRad);
  var sB = Math.sin(betaRad);
  var cG = Math.cos(gammaRad);
  var sG = Math.sin(gammaRad);

  // Calculate A, B, C rotation components
  var rA = - cA * sG - sA * sB * cG;
  var rB = - sA * sG + cA * sB * cG;
  var rC = - cB * cG;

  // Calculate compass heading
  var compassHeading = Math.atan(rA / rB);

  // Convert from half unit circle to whole unit circle
  if(rB < 0) {
    compassHeading += Math.PI;
  }else if(rA < 0) {
    compassHeading += 2 * Math.PI;
  }

  // Convert radians to degrees
  compassHeading *= 180 / Math.PI;

  return compassHeading;
}


navigator.geolocation.getCurrentPosition(throttle(function(position) {
    write('latitude', position.coords.latitude)
    write('longitude', position.coords.longitude)
}));

let event = '';
if (window.ondeviceorientationabsolute) {
    event = 'ondeviceorientationabsolute';
    console.log('Using: ondeviceorientationabsolute')
} else if (window.DeviceOrientationEvent) {
    event = 'DeviceOrientationEvent';
    console.log('Using: DeviceOrientationEvent')
} else {
    console.warn('no compass');
}
window.addEventListener('deviceorientation', throttle(({alpha, beta, gamma, absolute}) => {
    const heading = compassHeading(alpha, beta, gamma);
    console.log('heading', heading);
    write('heading', heading);
    write('absolute', absolute)
    write('alpha', alpha)
    write('beta', beta)
    write('gamma', gamma)
}), true);
