import { useState, useEffect } from 'react';
import './App.css'
import correctAudio from '../src/assets/correct-choice-43861.mp3';
import incorrectAudio from '../src/assets/incorrect-293358 (1).mp3';
console.log(incorrectAudio);
console.log(correctAudio);
const statusObj = {
  'win':{
    id:'win',
    text:'You win! ',
    insultText:[''],
    tipText:['You are officially amazing! 🔥','Why did it take blud so long? 😂','Alr... 👌','You winning son? 🧔‍♂️']
  },
  'lose':{
    id:'lose',
    text:'You lose! ',
    insultText:['Skill issue! 💀','Blud is not him... 🤣','Get some help 💁‍♂️','Imagine 😭','You rn 🫵🤡','meh meh 👎']
  },
  'none':{
    id:'none',
    text:'',
    insultText:['']
  }
}
function shuffleArr(arr){
  for(let i = arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr
}
function Gui({score,isPlaying,defeats,victories,roundStatus}){
  const [seconds,setSeconds] = useState(5);
  const [settings,setSettings] = useState({});
  const [settingsOn,setSettingsOn] = useState(false);
  const [infoOn,setInfoOn] = useState(false);
  let intervalId;
  useEffect(()=>{
    console.log('is playing', isPlaying)
    if(!isPlaying){

      setSeconds(5)
      intervalId = setInterval(()=>{
        setSeconds(prev=>prev-1)
        console.log(seconds)
      },1000)
    }
  return ()=>{clearInterval(intervalId)}}
  //returning a clean up function to make sure we don't have multiple intervals.
,[isPlaying])
    console.log(isPlaying)
  return(
    <div>
      <div id='stats'>
      <img src='public\user-groups-with-add-delete-heart-question-mark.png' onClick={()=>{setInfoOn(prev=>!prev)}} id='info-img'/>
      <p>Score: {score}</p>
      <p>Victories: {victories}</p>
      <p>Defeats: {defeats}</p></div>
      {!isPlaying && 
      <div id='starting-container' className={seconds>0?'fade-in':'fade-out'}>
        <p><span id={statusObj[roundStatus].id}>{statusObj[roundStatus].text}</span><span id='starting-text'>{seconds>0? `Game starts in ${seconds}`:'Game started!'}</span></p>
        <p><span className='bounce'>.</span><span className='bounce'>.</span><span className='bounce'>.</span></p>
        {roundStatus==='lose' && <p id={`lose-text`}>{statusObj[roundStatus].insultText[Math.floor(Math.random()*statusObj.lose.insultText.length)]}</p>}
      </div>}
      {infoOn && <div id='info-container' className={infoOn?'slide-in':'slide-out'}>
        <details>
          <summary>How To Play</summary>
            <p className='details-text'>To win, don't click the same card twice!</p>
        </details>
        <details>
          <summary>Resources</summary>
          <ul>
            <li className='details-text'><a href='https://rickandmortyapi.com'>Rick and morty api</a></li>
            <li className='details-text'><a href='https://www.flaticon.com/free-icons/settings' title='settings icons'>Settings icons</a></li>
            <li className='details-text'>Lose Sound Effect by <a href="https://pixabay.com/users/u_n2rdb8hxnh-48483999/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=293358">u_n2rdb8hxnh</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=293358">Pixabay </a></li>
            <li className='details-text'>Win Sound Effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=43861">freesound_community</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=43861">Pixabay</a></li>
          </ul>
        </details>
      </div>}
  </div>
  )
}
function Game({setScore,isPlaying,setIsPlaying,setDefeats,setVictories,setRoundStatus}){
  const [list,setList] = useState([]);
  const [clickedImgs,setClickedImgs] = useState([]);
  function onClick(e){
    const clickedId = e.currentTarget.value;
    if(clickedImgs.find(id=>id===clickedId)){
      console.log('found img thats been already clicked')
      setIsPlaying(false);
      console.log('is playing: ',isPlaying)
      setDefeats(prev=>prev+1);
      setRoundStatus('lose');
      return
    }
    setClickedImgs(prev=>[...prev,clickedId])
    console.log([...clickedImgs,clickedId])
    setScore(prev=>prev+1);
    console.log(clickedImgs.length)
    if(clickedImgs.length+1 >= list.length){
      console.log('player won!');
      setIsPlaying(false);
      setVictories(victories=>victories+1);
      setRoundStatus('win');
      return
    }
    setList(shuffleArr(list));
  }
  function startGame(){
    console.log('starting game...');
    setTimeout(()=>{
    setScore(0);
    setClickedImgs([]);
    setTimeout(()=>{
    getImages();},500) //extra time for fade out
    },5000) 
  }
  const getImages = async ()=>{
    try{
      let res = await fetch('https://rickandmortyapi.com/api/character/?gender=Male&page=1');
      let data = await res.json();
      console.log(data);
      setList(shuffleArr(data.results));
      setIsPlaying(true);
    }
    catch(err){
      throw new Error(err)
    }

  }
  useEffect(()=>{
    if(!isPlaying)startGame() //restarts game when finished or lost or win;
  },[isPlaying]);
  return(
    isPlaying && <div id='game-container' className={isPlaying? 'fade-in':'fade-out'}>
      {list.map(result=><button key={result.id} onClick={onClick} className='grid-btn' value={result.id}><img  src={result.image} width='100%' height='100%' /></button>)}
    </div>
  )
}
function App() {
  const [score,setScore] = useState(0);
  const [isPlaying,setIsPlaying] = useState(false);
  const [defeats,setDefeats] = useState(0);
  const [victories,setVictories] = useState(0)
  const [roundStatus,setRoundStatus] = useState('none');
  return (
    <>
      <Gui score={score} isPlaying={isPlaying} defeats={defeats} victories={victories} roundStatus={roundStatus}/>
      <Game setScore={setScore} setIsPlaying={setIsPlaying} isPlaying={isPlaying} setDefeats={setDefeats} setVictories={setVictories} setRoundStatus={setRoundStatus}/>
    </>
  )
}

export default App