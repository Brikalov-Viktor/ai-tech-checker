import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';
import type { Question, Difficulty, AnswerFeedback } from '../../types';

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const QuestionText = styled.h2`
  color: #333;
  margin-bottom: 16px;
  font-size: 20px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const Badge = styled.span<{ $difficulty: Difficulty }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => {
    switch (props.$difficulty) {
      case 'easy':
        return 'background: #e8f5e9; color: #4caf50;';
      case 'medium':
        return 'background: #fff3e0; color: #ff9800;';
      case 'hard':
        return 'background: #ffebee; color: #f44336;';
      default:
        return 'background: #f5f5f5; color: #666;';
    }
  }}
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 150px;
  margin-bottom: 20px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const FeedbackCard = styled.div<{ $isCorrect?: boolean }>`
  background: ${props => props.$isCorrect ? '#e8f5e9' : '#ffebee'};
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  border-left: 4px solid ${props => props.$isCorrect ? '#4caf50' : '#f44336'};
`;

const Mark = styled.div<{ $mark: number }>`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.$mark >= 4 ? '#4caf50' : props.$mark >= 3 ? '#ff9800' : '#f44336'};
  margin-bottom: 8px;
`;

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onSubmit: (answer: string) => Promise<void>;
  isSubmitting: boolean;
  feedback?: AnswerFeedback;
}

const difficultyText: Record<Difficulty, string> = {
  easy: 'Легкий',
  medium: 'Средний',
  hard: 'Сложный'
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  total,
  onSubmit,
  isSubmitting,
  feedback
}) => {
  const [answer, setAnswer] = useState('');
  
  const handleSubmit = async () => {
    if (answer.trim()) {
      await onSubmit(answer);
    }
  };
  
  return (
    <Card>
      <MetaInfo>
        <Badge $difficulty={question.difficulty}>
          {difficultyText[question.difficulty]}
        </Badge>
        <span>Тема: {question.subject.name}</span>
        <span>Вопрос {index + 1} из {total}</span>
      </MetaInfo>
      
      <QuestionText>{question.text}</QuestionText>
      
      {!feedback ? (
        <>
          <TextArea
            placeholder="Напишите ваш ответ здесь..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Ответить'}
          </Button>
        </>
      ) : (
        <FeedbackCard $isCorrect={feedback.isCorrect}>
          <Mark $mark={feedback.mark}>Оценка: {feedback.mark}/5</Mark>
          <div style={{ marginTop: 8 }}>{feedback.feedback}</div>
        </FeedbackCard>
      )}
    </Card>
  );
};