const socket = io('/');
const myPeer = new Peer();
const peers = {};

myPeer.on('open', (id) => {
  socket.emit('join-room', roomId, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', (userId) => {
    console.log('userId: ' + userId + ' has connected.');
    connectToNewUser(userId, stream);
  });
});

socket.on('user-disconnected', userId => {
  console.log(userId + ' user-disconnected');
  if (peers[userId]) peers[userId].close();
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}