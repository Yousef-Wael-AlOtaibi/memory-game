import { useState, useEffect } from 'react';
import './App.css'
const statusObj = {
  'win':{
    id:'win',
    text:'You win! ',
    tipText:['You are officially amazing! 🔥','Why did it take blud so long? 😂','Alr... 👌','You winning son? 🧔‍♂️']
  },
  'lose':{
    id:'lose',
    text:'You lose!',
    tipText:['Skill issue! 💀','Blud is not him... 🤣','Get some help 💁‍♂️','bro, if you need help just ask 🙏','You rn 🫵🤡','meh meh 👎']
  },
  'none':{
    id:'none',
    text:'',
    tipText:['Do NOT click the same card twice! 🚫']
  }
}
function shuffleArr(arr){
  for(let i = arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
    console.log(arr);
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
      <p>{score}</p>
      {!isPlaying && 
      <div id='starting-container' className={seconds>0?'fade-in':'fade-out'}>
        <p><span id={statusObj[roundStatus].id}>{statusObj[roundStatus].text}</span>{seconds>0? `Game starts in ${seconds}`:'Game started!'}</p>
        <p id='tip-text'>{statusObj[roundStatus].tipText[Math.floor(Math.random()*statusObj[roundStatus].tipText.length)]}</p>
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
    setScore(prev=>prev+1);
    setList(shuffleArr(list))
  }
  function startGame(){
    console.log('starting game...');
    setTimeout(()=>{
    setScore(0);
    setClickedImgs([]);
    getImages();
    },5000) // 3150 instead of 3000, to help sync the loading gui and the game load itself.
  }
  const getImages = async ()=>{
    try{
      const res = await fetch('https://rickandmortyapi.com/api/character/?gender=Male');
      const data = await res.json();
      setList(data.results);
      setIsPlaying(true);
    }
    catch(err){
      throw new Error(err)
    }

  }
  useEffect(()=>{
    if(!isPlaying)startGame() //restarts game when finished or lost;
  },[isPlaying]);
  return(
    <div>
      {list.map(result=><button key={result.id} onClick={onClick} value={result.id}><img  src={result.image} /></button>)}
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
