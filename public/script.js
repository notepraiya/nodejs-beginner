const socket = io('/');
const myPeer = new Peer();
myPeer.on('open', (id) => {
  socket.emit('join-room', roomId, id);
});

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);
  socket.on('user-connected', (userId) => {
    console.log('userId: ' + userId + ' has connected.');
  });
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}