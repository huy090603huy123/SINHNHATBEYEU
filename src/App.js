import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import Confetti from 'react-confetti';
import BirthdayCard from './BirthdayCard';
import birthdaySound from './assets/happy-birthday.mp3'; // Make sure you have this file in src/assets

// Keyframes for animations
const flicker = keyframes`
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50% { opacity: 0.7; transform: scaleY(0.95); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Global Styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&display=swap');
  
  body {
    /* Animated Gradient Background */
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: ${gradientAnimation} 15s ease infinite;
    
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
  }
`;

// Styled Components
const AppContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 100%;
`;

const Title = styled.h1`
  font-family: 'Pacifico', cursive;
  color: #ffffff;
  font-size: clamp(2.5rem, 10vw, 4.5rem); /* Responsive font size */
  text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
  margin-bottom: 20px;
`;

const StartButton = styled.button`
  background-color: #ff9a9e;
  border: none;
  border-radius: 50px;
  color: white;
  padding: 15px 35px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const Instruction = styled.p`
  color: #fff;
  font-size: 1.3rem;
  margin-bottom: 20px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
`;

const CakeContainer = styled.div`
  position: relative;
  margin-top: 50px;
`;

const Cake = styled.div`
  width: 250px;
  height: 120px;
  background: #f2d7d5;
  border-radius: 50% 50% 10px 10px / 20% 20% 10px 10px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
`;

const Icing = styled.div`
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 30px;
  background: #fff;
  border-radius: 50%;
  box-shadow: inset 0 -3px 3px rgba(0,0,0,0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 20px;
    background: repeating-linear-gradient(
      45deg,
      #ffc0cb,
      #ffc0cb 10px,
      #fff 10px,
      #fff 20px
    );
    border-radius: 50% 50% 0 0;
  }
`;

const Candle = styled.div`
  position: absolute;
  bottom: 100px;
  transform: translateX(-50%);
  width: 10px;
  height: 50px;
  background: #f9f9f9;
  border-radius: 5px 5px 0 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 4px;
    width: 2px;
    height: 10px;
    background: #333;
  }
`;

const Flame = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 15px;
  background: #ffac33;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: ${flicker} 1.5s infinite;
`;

const App = () => {
  const [candlesOn, setCandlesOn] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneStreamRef = useRef(null);
  const audioPlayer = useRef(null);

  const handleBlow = () => {
    setCandlesOn(false);
    setShowConfetti(true);
    setIsListening(false);

    if (audioPlayer.current) {
        audioPlayer.current.play();
    }
    
    setTimeout(() => setShowCard(true), 1000);
  };

  useEffect(() => {
    let animationFrameId;

    if (isListening) {
      const handleMicInput = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          microphoneStreamRef.current = stream;
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioContext;
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const checkBlow = () => {
            if (!analyserRef.current) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            
            if (average > 65) { // Sensitivity can be adjusted here
              handleBlow();
            } else {
              animationFrameId = requestAnimationFrame(checkBlow);
            }
          };
          checkBlow();

        } catch (err) {
          console.error('Error accessing microphone:', err);
          alert("Could not access the microphone. Please grant permission and try again, preferably on Chrome or Firefox.");
          setIsListening(false);
        }
      };
      handleMicInput();
    }

    return () => {
      // Cleanup function
      cancelAnimationFrame(animationFrameId);
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);


  const handleStart = () => {
    setIsListening(true);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <audio ref={audioPlayer} src={birthdaySound} preload="auto" />
        
        {showConfetti && (
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={false}
            numberOfPieces={600}
            tweenDuration={15000}
            gravity={0.15}
            wind={0.05}
            initialVelocityX={5}
            initialVelocityY={20}
            colors={['#FFC700', '#FF0000', '#2E3192', '#41BBC7', '#F48024', '#22B573']}
            confettiSource={{
              x: 0,
              y: window.innerHeight,
              w: window.innerWidth,
              h: 0,
            }}
          />
        )}
        
        <Title>Chúc Mừng Sinh Nhật!</Title>

        {!isListening && candlesOn && (
          <StartButton onClick={handleStart}>
            Nhấn vào đây và thổi nến nhé!
          </StartButton>
        )}

        {isListening && candlesOn && (
          <Instruction>Hãy thổi vào micro để tắt nến!</Instruction>
        )}

        <CakeContainer>
          <Cake>
            <Icing />
            {candlesOn && (
              <>
                <Candle style={{ left: '30%' }}><Flame /></Candle>
                <Candle style={{ left: '50%' }}><Flame /></Candle>
                <Candle style={{ left: '70%' }}><Flame /></Candle>
              </>
            )}
          </Cake>
        </CakeContainer>

        {showCard && <BirthdayCard />}
      </AppContainer>
    </>
  );
};

export default App;
