import React from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';
import type { CompleteInterviewResponse } from '../../types';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 24px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 32px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 16px;
`;

const Score = styled.div<{ $score: number }>`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  color: ${props => props.$score >= 80 ? '#4caf50' : props.$score >= 60 ? '#ff9800' : '#f44336'};
  margin: 24px 0;
`;

const Recommendations = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
`;

const RecommendationTitle = styled.h3`
  color: #667eea;
  margin-bottom: 12px;
`;

const ResultsList = styled.div`
  margin-top: 20px;
`;

const ResultItem = styled.div<{ $isCorrect: boolean }>`
  padding: 12px;
  margin: 8px 0;
  background: ${props => props.$isCorrect ? '#e8f5e9' : '#ffebee'};
  border-radius: 8px;
  border-left: 4px solid ${props => props.$isCorrect ? '#4caf50' : '#f44336'};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: center;
`;

interface ResultsModalProps {
  results: CompleteInterviewResponse['data'];
  onClose: () => void;
  onDownloadPDF: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  results,
  onClose,
  onDownloadPDF
}) => {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Результаты интервью</Title>
        
        <Score $score={results.score}>
          {Math.round(results.score)}%
        </Score>
        
        <Recommendations>
          <RecommendationTitle>📝 Рекомендации по развитию</RecommendationTitle>
          {results.recommendations.map((rec: string, idx: number) => (
            <div key={idx} style={{ marginBottom: 8 }}>• {rec}</div>
          ))}
        </Recommendations>
        
        <RecommendationTitle>📊 Детальный разбор</RecommendationTitle>
        <ResultsList>
          {results.results.map((result, idx) => (
            <ResultItem key={idx} $isCorrect={result.isCorrect}>
              <strong>Вопрос {idx + 1}:</strong> {result.questionText}<br />
              <strong>Ваш ответ:</strong> {result.userAnswer}<br />
              <strong>Оценка:</strong> {result.mark}/5<br />
              <strong>Обратная связь:</strong> {result.feedback}
            </ResultItem>
          ))}
        </ResultsList>
        
        <ButtonGroup>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={onDownloadPDF}>
            Скачать PDF
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};