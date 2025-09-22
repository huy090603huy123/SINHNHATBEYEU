import React, { useState } from 'react';
import styled from 'styled-components';
import ReactCardFlip from 'react-card-flip';

const CardContainer = styled.div`
  margin-top: 50px;
  perspective: 1000px;
  cursor: pointer;
`;

const CardFace = styled.div`
  width: 300px;
  height: 420px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  font-family: 'Dancing Script', cursive;
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
  color: white;
  font-size: 2rem;

  h2 {
    margin: 0;
  }

  p {
    font-size: 1rem;
    font-family: 'Arial', sans-serif;
  }
`;

const CardBack = styled(CardFace)`
  background: #fdfbfb;
  color: #555;
  font-size: 1.2rem;

  p {
    margin: 10px 0;
  }
`;

const BirthdayCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <CardFront onClick={handleClick}>
        <h2>Một món quà nhỏ</h2>
        <p>(Nhấn vào để mở)</p>
        
      </CardFront>

      <CardBack onClick={handleClick}>
        <h3>Gửi đến bạn,</h3>
        <p>Chúc bạn một ngày sinh nhật thật vui vẻ, hạnh phúc và tràn ngập tiếng cười. Mong rằng những điều tốt đẹp nhất sẽ đến với bạn trong tuổi mới.</p>
        <p>Thêm một tuổi mới, thêm nhiều niềm vui và thành công mới nhé!</p>
        <h4>Yêu thương,</h4>
        <p>Người bạn AI 🤖</p>
      </CardBack>
    </ReactCardFlip>
  );
};

export default BirthdayCard;