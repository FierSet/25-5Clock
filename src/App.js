import React from 'react';
import './App.css';
import Colors from './Colors'

function App() 
{
  let defautbreak = 5 * 60;
  let defaultsession = 25 * 60;
  const [color] = React.useState(Math.floor(Math.random() * Colors.length));
  const [displaytime, setdisplaytime] = React.useState(defaultsession)
  const [breakTime, setbreakTime] = React.useState(defautbreak);
  const [sessiontime, setsessiontime] = React.useState(defaultsession);
  const [timeOn, setTimeOn] = React.useState(false);

  const [onBreak, setonbreak] = React.useState(false);
  const [colorText, setcolorText] = React.useState('#000000');

  const playaudio = () =>
  {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/09/27/audio_91211934db.mp3?filename=clock-alarm-8761.mp3');
    audio.currentTime = 0;
    audio.play();
  };

  const changeTime = (amount, type) =>
  {
      if(type === 'break')
      {
        if(breakTime <= 60 && amount < 0)
          return;
        setbreakTime((prev) => prev + amount);
      }
      if(type === 'session')
      { 
        if(sessiontime <= 60 && amount < 0)
          return;
        setsessiontime((prev) => prev + amount);
        setdisplaytime((prev) => prev + amount);
        if(!timeOn)
          setdisplaytime(sessiontime + amount);
      }
  };

  const formatTime = (t) =>
  {
    let minutes = Math.floor(t / 60);
    let seconds = t % 60;

    return(
      (minutes < 10 ? "0" + minutes : minutes) 
                  + ":" +
      (seconds < 10 ? "0" + seconds: seconds)
    );
  };

  const controltime = () => // error in intervar double action
  {
    let onBreakvariable = onBreak;//\  
    let valuea = displaytime;     //-- I use this variables for the error interval
    if(!timeOn)
    {
      let intervar = setInterval(() => 
      {
        setdisplaytime(() => 
        {
          valuea = valuea - 1;
          if(valuea > 60)
            setcolorText('#000000');
          else
            setcolorText('#DC143C');
          
          if(valuea <= 0 && !onBreakvariable)
          {
            playaudio();
            onBreakvariable = !onBreakvariable;
            setonbreak(onBreakvariable);
            valuea = breakTime;
            return(valuea);
          }
          else if(valuea <= 0 && onBreakvariable)
          {
            playaudio();
            onBreakvariable = !onBreakvariable;
            setonbreak(onBreakvariable);
            valuea = sessiontime;
            return (valuea);
          }
          else
            return (valuea);
        });
      }, 1000);

      localStorage.clear();
      localStorage.setItem("interval-id", intervar);
    }

    if(timeOn)
      clearInterval(localStorage.getItem("interval-id"));
    
    setTimeOn(!timeOn);
  };

  const resetTime = () =>
  {
    setcolorText('#000000');
    setdisplaytime(defaultsession);
    setbreakTime(defautbreak);
    setsessiontime(defaultsession);
    controltime();
  };

  return (
    <div className = 'App center-align' style = {{backgroundColor: Colors[color], minHeight: "100vh"}}>
        
        <h1>25 + 5 Clock</h1>
        <div className = 'dual-container'>
          <Length 
            title = {'Break length'} 
            changeTime = {changeTime} 
            type = {'break'} 
            time = {breakTime} 
            formatTime = {formatTime}
          />

          <Length 
            title = {'session length'} 
            changeTime = {changeTime} 
            type = {'session'} 
            time = {sessiontime} 
            formatTime = {formatTime}
          />
        </div>
        <h3 style = {{color: colorText}}>{onBreak ? "Break Length" : "Session Length"}</h3>
        <h1 style = {{color: colorText}}>{formatTime(displaytime)}</h1>
        <button className = 'btn-large deep-purple lighten-2' onClick = {controltime}>
          {timeOn ? 
            (<i className = 'material-icons'>pause_circle_filled</i>)
                                  :
            (<i className = 'material-icons'>play_circle_filled</i>)
          }
        </button>

        <button className = 'btn-large deep-purple lighten-2' onClick = {resetTime}>
          <i className='material-icons'>autorenew</i>
        </button>
    </div>
  );
}

function Length ({title, changeTime, type, time, formatTime})
{
  return (
    <div>
      <h3>{title}</h3>
      <div className = 'time-sets'>
        <button className = 'btn-small deep-purple lighten-2' onClick = {() => changeTime(-60, type)}>
          <i className = 'material-icons'>arrow_downward</i>
        </button>

        <h3>{formatTime(time)}</h3>
        <button className = 'btn-small deep-purple lighten-2' onClick = {() => changeTime(60, type)}>
          <i className = 'material-icons'>arrow_upward</i>
        </button>

      </div>
    </div>
  );
}

export default App;
