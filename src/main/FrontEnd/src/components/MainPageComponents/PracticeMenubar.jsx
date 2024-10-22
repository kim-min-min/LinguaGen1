"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MainMenu = styled.ul`
  width: 250px;
  display: block;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

`;

const Item = styled.li`
  border-top: 1px solid #fff;
  overflow: hidden;
`;

const Btn = styled.a`
  display: block;
  padding: 15px 20px;
  background-color: #e2e8f0;
  color: black;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  user-select: none;

  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid #e2e8f0;
    right: 15px;
    bottom: -10px;
    z-index: 9;
  }

  i {
    margin-right: 10px;
  }
`;

const SubMenu = styled.div`
  background: #0f172a;
  overflow: hidden;
  transition: max-height 0.7s;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  user-select: none;

  a {
    display: block;
    padding: 15px 20px;
    color: #fff;
    font-size: 14px;
    border-bottom: 1px solid #394c7f;
    position: relative;

    &:before, &:after {
      content: '';
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover:before {
      content: '';
      position: absolute;
      height: 0;
      width: 6px;
      left: 0;
      top: 0;
      opacity: 1;
      border-top: 24px solid transparent;
      border-left: 11px solid #e2e8f0;
      border-bottom: 24px solid transparent;
    }

    &:hover:after {
      content: '';
      position: absolute;
      height: 0;
      width: 6px;
      right: 0px;
      top: 0;
      opacity: 1;
      border-top: 24px solid transparent;
      border-right: 11px solid #e2e8f0;
      border-bottom: 24px solid transparent;
    }

    &:hover {
      background: linear-gradient(to bottom, #273057 0%, #273057 50%, #394c7 51%, #e2e8f0 100%);
      transition: all 0.3s;
      border-bottom: 1px solid #394c7f;
    }

    &:last-child {
      border: none;
    }
  }
`;

const PracticeMenubar = ({ setSelectedGame }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const handleMenuClick = (value) => {
    setSelectedGame(value);
  }

  return (
    <Wrapper>
      <MainMenu>
        <Item>
          <Btn onClick={() => toggleMenu('reading')}><i className="fas fa-book"></i>리딩 유형</Btn>
          <SubMenu isOpen={openMenu === 'reading'}>
            <a onClick={() => handleMenuClick('주제/제목 찾기')}>주제/제목 찾기</a>
            <a onClick={() => handleMenuClick('요지 파악')}>요지 파악</a>
            <a onClick={() => handleMenuClick('세부 정보 찾기')}>세부 정보 찾기</a>
            <a onClick={() => handleMenuClick('지칭 추론')}>지칭 추론</a>
            <a onClick={() => handleMenuClick('어휘추론')}>어휘추론</a>
          </SubMenu>
        </Item>
        <Item>
          <Btn onClick={() => toggleMenu('listening')}><i className="fas fa-headphones"></i>리스닝 유형</Btn>
          <SubMenu isOpen={openMenu === 'listening'}>
            <a onClick={() => handleMenuClick('주제/제목 파악')}>주제/제목 파악</a>
            <a onClick={() => handleMenuClick('세부 정보 듣기')}>세부 정보 듣기</a>
            <a onClick={() => handleMenuClick('화자의 태도/의견 추론')}>화자의 태도/의견 추론</a>
            <a onClick={() => handleMenuClick('대화/강의 구조 파악')}>대화/강의 구조 파악</a>
            <a onClick={() => handleMenuClick('함축적 의미 추론')}>함축적 의미 추론</a>
          </SubMenu>
        </Item>
        <Item>
          <Btn onClick={() => toggleMenu('others')}><i className="fas fa-ellipsis-h"></i>기타 유형</Btn>
          <SubMenu isOpen={openMenu === 'others'}>
            <a onClick={() => handleMenuClick('문법 문제')}>문법 문제</a>
            <a onClick={() => handleMenuClick('어휘 문제')}>어휘 문제</a>
            <a onClick={() => handleMenuClick('말하기 문제')}>말하기 문제</a>
            <a onClick={() => handleMenuClick('쓰기 문제')}>쓰기 문제</a>
          </SubMenu>
        </Item>
        <Item>
          <Btn onClick={() => toggleMenu('methods')}><i className="fas fa-question-circle"></i>문제 푸는 방법</Btn>
          <SubMenu isOpen={openMenu === 'methods'}>
            <a onClick={() => handleMenuClick('빈칸 채우기')}>빈칸 채우기</a>
            <a onClick={() => handleMenuClick('사지선다')}>사지선다</a>
            <a onClick={() => handleMenuClick('True/False/Not Given')}>True/False/Not Given</a>
            <a onClick={() => handleMenuClick('문장 삽입')}>문장 삽입</a>
            <a onClick={() => handleMenuClick('짝짓기')}>짝짓기</a>
            <a onClick={() => handleMenuClick('글의 순서 배열')}>글의 순서 배열</a>
            <a onClick={() => handleMenuClick('오류찾기')}>오류찾기</a>
            <a onClick={() => handleMenuClick('답답형')}>답답형</a>
          </SubMenu>
        </Item>
      </MainMenu>
    </Wrapper>
  );
};

export default PracticeMenubar;