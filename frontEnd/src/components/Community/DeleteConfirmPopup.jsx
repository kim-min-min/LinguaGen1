import React from 'react';
import styled from 'styled-components';
import { Button } from "@/components/ui/button";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const DeleteConfirmPopup = ({ onConfirm, onCancel }) => {
  return (
    <PopupOverlay>
      <PopupContent>
        <h2 className="text-xl font-bold mb-4">삭제 확인</h2>
        <p className="mb-6">정말 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            삭제
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            취소
          </Button>
        </div>
      </PopupContent>
    </PopupOverlay>
  );
};

export default DeleteConfirmPopup; 