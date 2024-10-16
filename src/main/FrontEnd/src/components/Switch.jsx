import React from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.div`
  width: 50px;
  height: 24px;
  background-color: ${({ checked }) => (checked ? '#00b894' : '#ccc')};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const SwitchBall = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ checked }) => (checked ? '26px' : '2px')};
  transition: left 0.3s ease;
`;

const Switch = ({ checked, onChange }) => {
  return (
    <SwitchContainer checked={checked} onClick={onChange}>
      <SwitchBall checked={checked} />
    </SwitchContainer>
  );
};

export default Switch;
