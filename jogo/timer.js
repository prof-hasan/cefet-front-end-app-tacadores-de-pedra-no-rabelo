const timerDiv = document.createElement('div');
    timerDiv.style.position = 'fixed';
    timerDiv.style.left = '50%';
    timerDiv.style.top = '40px';
    timerDiv.style.transform = 'translateX(-50%)';
    timerDiv.style.color = '#fff';
    timerDiv.style.fontSize = '2em';
    timerDiv.style.fontFamily = 'monospace';
    timerDiv.style.background = 'rgba(0,0,0,0.5)';
    timerDiv.style.padding = '8px 18px';
    timerDiv.style.borderRadius = '10px';
    timerDiv.style.zIndex = '9999';
    document.body.appendChild(timerDiv);
    let tempoRestante = 0;

    function atualizarTimer() {
        let min = Math.floor(tempoRestante / 60);
        let seg = tempoRestante % 60;
        timerDiv.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
        tempoRestante++;
        setTimeout(atualizarTimer, 1000);
    }

    atualizarTimer();