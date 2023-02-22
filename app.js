const videoElem = document.getElementById("videoSection");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
let oError;
let howmany = 0;
let mediarecorder = null;
let chunks = [];
let captureScreen = document.getElementById('captureScreen')
let recording = document.getElementById('recording')
const downloadATag = document.getElementById("download");
const downloadButton = document.getElementById("downloadButton");
let videourl;

captureScreen.classList.remove('hide')


captureScreen.addEventListener('click', function () {
    captureScreen.classList.add('hide')
    start.classList.remove('hide')
    stop.classList.remove('hide')
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        DisplayCaptureSurfaceType: "browser"
    }).then(stream => {
        howmany++;
        console.log(videoElem.srcObject);
        videoElem.srcObject = stream;
        strm = stream
        mediarecorder = new MediaRecorder(stream);
        mediarecorder.ondataavailable = function (e) {
            chunks.push(e.data)
        }
        mediarecorder.onstop = function (ev) {
            let blob = new Blob(chunks, {
                type: "video/mp4"
            });
            videourl = window.URL.createObjectURL(blob);

        }
    }).catch(Error => {
        console.log("Error :" + Error);
        oError = e;
    });
})
start.onclick = function () {
    if (mediarecorder.state === 'recording') return Swal.fire({
        title: 'Error!',
        text: 'Still recording!',
        icon: 'error',
        confirmButtonText: 'OK'
    })
    recording.classList.remove('hide')
    mediarecorder.start()

}
stop.onclick = function () {
    if (!mediarecorder ) return Swal.fire({
        title: 'Error!',
        text: 'Please capture screen first!',
        icon: 'error',
        confirmButtonText: 'OK'
    })
    if(mediarecorder.state === 'inactive') return Swal.fire({
        title: 'Error!',
        text: 'Please record screen first!',
        icon: 'error',
        confirmButtonText: 'OK'
    })
    Swal.fire({
        title: 'Success!',
        text: 'You can download your video.',
        icon: 'success',
        confirmButtonText: 'OK'
    })
    recording.classList.add('hide')
    downloadButton.classList.remove('hide')
    mediarecorder.stop();

}

downloadATag.addEventListener('click', function () {
    if(!videourl) return Swal.fire({
        title: 'Error!',
        text: 'Please record screen!',
        icon: 'error',
        confirmButtonText: 'OK'
    })
    downloadATag.href = videourl;
    downloadATag.download = "capture.mp4";
    console.log("Video Link : " + videourl);
})