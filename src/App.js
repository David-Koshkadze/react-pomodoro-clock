import { useState, useEffect } from 'react';

function App() {
  const [displayTime, setDisplayTime] = useState(3);
  const [sessionTime, setSessionTime] = useState(3);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  useEffect(() => {
    let timeText = onBreak ? 'Time to rest!' : 'Time to work!';
    document.title = formatTime(displayTime) + ' - ' + timeText;
  }, [displayTime]);

  const [breakAudio] = useState(
    new Audio(
      'https://media.jpkarlsven.com/audio/codepen/pomodoro-clock/stop.mp3'
    )
  );

  const playBreakSound = () => {
    breakAudio.play();
  };

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
  }

  const changeTime = (amount, type) => {
    if (type === 'break') {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else if (type === 'session') {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem('interval-id', interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem('interval-id'));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div className="container">
      <h1>Pomodoro Clock</h1>
      <h3>{onBreak ? "Break" : "Session"}</h3>
      <span className="display_time">{formatTime(displayTime)}</span>
      <div className="content">
        <div>
          <Length
            title="Break Length"
            changeTime={changeTime}
            type="break"
            time={breakTime}
            formatTime={formatTime}
          />
        </div>
        <div>
          <Length
            title="Session Length"
            changeTime={changeTime}
            type="session"
            time={sessionTime}
            formatTime={formatTime}
          />
        </div>
      </div>
      <button className="btn" onClick={controlTime}>
        {timerOn ? (
          <span>
            <i class="fa fa-pause" aria-hidden="true"></i>
            <span style={{ marginLeft: '7px' }}>Pause</span>
          </span>
        ) : (
          <span>
            <i class="fa fa-play" aria-hidden="true"></i>
            <span style={{ marginLeft: '7px' }}>Start</span>
          </span>
        )}
      </button>
      <button className="btn" onClick={resetTime}>
        <i class="fa fa-refresh" aria-hidden="true"></i>
        <span style={{ marginLeft: '7px' }}>Reset</span>
      </button>
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <>
      <h3>{title}</h3>
      <div className="time_controls">
        <button onClick={() => changeTime(60, type)} className="btn-control">
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
        </button>
        <p>{formatTime(time)}</p>
        <button onClick={() => changeTime(-60, type)} className="btn-control">
          <i className="fa fa-arrow-down" aria-hidden="true"></i>
        </button>
      </div>
    </>
  );
}

export default App;
