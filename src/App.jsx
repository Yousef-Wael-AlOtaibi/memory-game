import { useState, useEffect } from 'react';
import './App.css'
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
    insultText:['Skill issue! 💀','Blud is not him... 🤣','Get some help 💁‍♂️','bro, if you need help just ask 🙏','You rn 🫵🤡','meh meh 👎']
  },
  'none':{
    id:'none',
    text:'Welcome. ',
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
  const [seconds,setSeconds] = useState(5)
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
      <div id='stats'><p>Score: {score}</p><p>Victories: {victories}</p><p>Defeats: {defeats}</p></div>
      {!isPlaying && 
      <div id='starting-container' className={seconds>0?'fade-in':'fade-out'}>
        <p><span id={statusObj[roundStatus].id}>{statusObj[roundStatus].text}</span>{seconds>0? `Game starts in ${seconds}`:'Game started!'}</p>
        {roundStatus==='lose' && <p id={`lose-text`}>{statusObj[roundStatus].insultText[Math.floor(Math.random()*statusObj.lose.insultText.length)]}</p>}
      </div>}
      <div id='info-container'>
        <details className='info'><summary>How to play</summary><ul><li>Don't pick the same img twice!</li><li>To win, click all imgs once!</li></ul></details>
        <details className='info'><summary>Insults list</summary><ul>{statusObj.lose.insultText.map(insult=><li key={statusObj.lose.insultText.indexOf(insult)+1}><b>{statusObj.lose.insultText.indexOf(insult)+1}.</b> {insult}</li>)}</ul></details></div>
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
