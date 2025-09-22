import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactCardFlip from 'react-card-flip';
import birthdayImage from './assets/birthday-image.jpg'; // Import the image

// --- Keyframes for Animations ---
const pulsate = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); opacity: 1; }
  50% { transform: translateY(-20px); opacity: 0.8; }
  100% { transform: translateY(0px); opacity: 1; }
`;

// --- Styled Components ---

const CardContainer = styled.div`
  margin-top: 50px;
  perspective: 1500px; /* Hiệu ứng 3D mạnh hơn */
  cursor: pointer;
  z-index: 10;
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;

  &:hover {
    transform: scale(1.05) translateY(-10px); /* Hiệu ứng nổi lên khi hover */
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const CardFace = styled.div`
  width: 380px;
  height: 450px; /* Cao hơn một chút để có thêm không gian */
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px;
  text-align: center;
  box-sizing: border-box;
  transition: all 0.4s ease;
  position: relative; /* Dùng cho các pseudo-elements */
  overflow: hidden; /* Ẩn các chi tiết trang trí bị tràn */
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  color: white;
  font-family: 'Dancing Script', cursive;

  /* Trái tim trang trí bay lơ lửng */
  &::before, &::after {
    content: '❤';
    position: absolute;
    font-size: 50px;
    opacity: 0.15;
    color: #fff;
    animation: ${float} 4s ease-in-out infinite;
  }
  
  &::before {
    top: 30px;
    left: 20px;
    animation-delay: 0.5s;
  }

  &::after {
    bottom: 40px;
    right: 30px;
    font-size: 70px;
    animation-duration: 5s;
  }

  h2 {
    font-size: 2.7rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    animation: ${pulsate} 2.5s ease-in-out infinite; /* Hiệu ứng đập nhẹ */
  }

  p {
    font-size: 1.2rem;
    font-family: 'Arial', sans-serif;
    margin-top: 15px;
    letter-spacing: 1px;
  }
`;

const CardBack = styled(CardFace)`
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  color: #444;
  font-size: 1.05rem;
  justify-content: space-around; /* Phân bổ không gian */
  font-family: 'Arial', sans-serif;

  p {
    margin: 5px 0;
    line-height: 1.6; /* Tăng khoảng cách dòng để dễ đọc hơn */
  }

  h4 {
    font-family: 'Dancing Script', cursive;
    font-size: 2rem;
    margin: 10px 0 5px 0;
    color: #d6336c;
  }
`;

// Khung ảnh kiểu Polaroid
const StyledImage = styled.div`
  background: white;
  padding: 10px 10px 20px 10px; /* Tạo viền trắng dày hơn ở dưới */
  border-radius: 5px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transform: rotate(-4deg); /* Hiệu ứng đặt nghiêng */
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(0deg) scale(1.05); /* Thẳng lại khi hover */
  }

  img {
    max-width: 100%;
    width: 250px;
    height: 180px;
    object-fit: cover;
    display: block;
  }
`;

const BirthdayCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <CardContainer>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <CardFront onClick={handleClick}>
          <h2>Một món quà nhỏ 🎁</h2>
          <p>(Chạm để mở)</p>
        </CardFront>

        <CardBack onClick={handleClick}>
          <StyledImage>
            <img src={birthdayImage} alt="Birthday Celebration" />
          </StyledImage>
          
          <p>
            Chúc mừng sinh nhật Thanh Danh 💖 
            Mong rằng em luôn rạng rỡ, hạnh phúc và được yêu thương thật nhiều. 
            Anh may mắn khi có em trong cuộc đời này, và sẽ luôn bên cạnh mang lại nụ cười cho em. 
            Chúc em tuổi mới đầy niềm vui và trọn vẹn yêu thương! 🎂✨
          </p>
          
          <h4>Yêu thương,</h4>
          <p>Người yêu của em 💕</p>
        </CardBack>
      </ReactCardFlip>
    </CardContainer>
  );
};

export default BirthdayCard;

