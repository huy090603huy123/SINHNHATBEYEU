import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import Confetti from 'react-confetti';
import BirthdayCard from './BirthdayCard';

// ... (thêm code CSS và các component con ở đây)

const App = () => {
  const [candlesOn, setCandlesOn] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneStreamRef = useRef(null);

  useEffect(() => {
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
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

            console.log("Average volume:", average); // Để debug

            if (average > 60) { // Điều chỉnh ngưỡng này nếu cần
              console.log("Blow detected!");
              setCandlesOn(false);
              setShowConfetti(true);
              setIsListening(false);
              setTimeout(() => setShowCard(true), 1000); // Hiển thị thiệp sau 1 giây
            } else if (isListening) {
              requestAnimationFrame(checkBlow);
            }
          };
          checkBlow();
        } catch (err) {
          console.error('Error accessing microphone:', err);
          alert("Không thể truy cập micro. Vui lòng cấp quyền và thử lại.");
          setIsListening(false);
        }
      };
      handleMicInput();
    } else {
      // Dọn dẹp
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    }
  }, [isListening]);


  const handleStart = () => {
    setIsListening(true);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
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
                <Candle style={{ left: '30%' }}>
                  <Flame />
                </Candle>
                <Candle style={{ left: '50%' }}>
                  <Flame />
                </Candle>
                <Candle style={{ left: '70%' }}>
                  <Flame />
                </Candle>
              </>
            )}
          </Cake>
        </CakeContainer>
        {showCard && <BirthdayCard />}
      </AppContainer>
    </>
  );
};

// (Đặt code này vào file App.js)

// Global Styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&display=swap');
  body {
    background: #282c34;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
  }
`;

// Keyframes for animations
const flicker = keyframes`
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50% { opacity: 0.7; transform: scaleY(0.95); }
`;

// Styled Components
const AppContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: 'Pacifico', cursive;
  color: #ffc0cb;
  font-size: 4rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
`;

const StartButton = styled.button`
  background-color: #ff9a9e;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-bottom: 20px;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Instruction = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 20px;
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

export default App;