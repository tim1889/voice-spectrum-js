function spectrum(param) {
  let voice = []; 
  let source = null;
  let isOver = true;
  const cav = document.getElementById(param.canvas);
  const ctx = cav.getContext('2d');
  cav.width = 200;
  cav.height = 200;
  cav.style.visibility = 'visible';

  cav.onclick = () => {
    if (isOver) {
      isOver = false;          
    } else {
      isOver = true;
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const file = new FileReader();
    file.onload = (e) => {
      const fileResult = e.target.result;
      context.decodeAudioData(fileResult, (buffer) => {
        visualize(context, buffer);
      }, (error) => {
        console.log('error: ', error);
      });
    }
    file.readAsArrayBuffer(param.source);
  }
  
  function visualize (context, buffer) {
    const sourceNode = context.createBufferSource();
    const analyser = context.createAnalyser();
    sourceNode.connect(analyser);
    analyser.connect(context.destination);
    sourceNode.connect(context.destination);
    sourceNode.buffer = buffer;
    sourceNode.start(0); 
    drawSpectrum(analyser, sourceNode);
  }
  
  function drawSpectrum (analyser, sourceNode) {
    const drawMeter = (deadline) => {
      if (isOver) {
        sourceNode.stop(0);
        spectrumDom([]);
        return;
      }
      const dataArray = new Uint8Array(64);
      analyser.getByteFrequencyData(dataArray);
      spectrumDom(dataArray);
      window.requestAnimationFrame(drawMeter);
    };
    window.requestAnimationFrame(drawMeter);
  }
  
  function spectrumDom (data) {
    ctx.clearRect(0, 0, 200, 200);
    for (let i = 0; i < data.length; i++) {
      ctx.fillStyle = '#c0dfd9';
      ctx.fillRect(i * 4, 100 - (data[i] / 4), 2, data[i] / 2);
      ctx.fill();
    }
  }
};