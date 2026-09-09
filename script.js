const peer = new Peer(); // Uses PeerJS public server
let mediaRecorder, recordedChunks = [];

// Mode switching
document.getElementById('broadcastMode').onclick = () => {
  document.getElementById('broadcastSection').style.display = 'block';
  document.getElementById('listenSection').style.display = 'none';

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      const video = document.getElementById('myVideo');
      video.srcObject = stream;

      peer.on('open', id => {
        document.getElementById('myPeerId').innerText = id;
      });

      document.getElementById('startBroadcast').onclick = () => {
        peer.on('call', call => {
          call.answer(stream); // Send stream to viewers
        });
      };

      document.getElementById('startRecord').onclick = () => {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
        mediaRecorder.start();
      };

      document.getElementById('stopRecord').onclick = () => {
        mediaRecorder.stop();
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const link = document.getElementById('downloadLink');
          link.href = url;
          link.download = 'recording.webm';
        };
      };
    });
};

document.getElementById('listenMode').onclick = () => {
  document.getElementById('listenSection').style.display = 'block';
  document.getElementById('broadcastSection').style.display = 'none';

  document.getElementById('connectBroadcast').onclick = () => {
    const broadcasterId = document.getElementById('broadcasterId').value;
    const call = peer.call(broadcasterId, null);
    call.on('stream', remoteStream => {
      document.getElementById('remoteVideo').srcObject = remoteStream;
    });
  };
};
