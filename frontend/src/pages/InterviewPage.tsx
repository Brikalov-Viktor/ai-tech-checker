import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { interviewAPI } from '../services/api';
import { QuestionCard } from '../components/interview/QuestionCard';
import { ResultsModal } from '../components/interview/ResultsModal';
import type { Question, Answer, CompleteInterviewResponse } from '../types';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
`;

const Progress = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  height: 8px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $width: number }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  width: ${props => props.$width}%;
  transition: width 0.3s;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

export const InterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<CompleteInterviewResponse['data'] | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    startInterview();
  }, []);
  
  const startInterview = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.start(3);
      if (response.success) {
        setInterviewId(response.data.interviewId);
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Не удалось начать интервью');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitAnswer = async (answerText: string) => {
    if (!interviewId) return;
    
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    
    setSubmitting(true);
    
    try {
      const response = await interviewAPI.submitAnswer(
        interviewId,
        currentQuestion.id,
        answerText
      );
      
      if (response.success) {
        const newAnswers = new Map(answers);
        newAnswers.set(currentQuestion.id, {
          questionId: currentQuestion.id,
          answer: answerText,
          feedback: response.data
        });
        setAnswers(newAnswers);
        
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          await completeInterview();
        }
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Ошибка при отправке ответа');
    } finally {
      setSubmitting(false);
    }
  };
  
  const completeInterview = async () => {
    if (!interviewId) return;
    
    try {
      const response = await interviewAPI.complete(interviewId);
      if (response.success) {
        setResults(response.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to complete interview:', error);
      alert('Ошибка при завершении интервью');
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!interviewId) return;
    
    try {
      window.open(`http://localhost:3001/api/pdf/interviews/${interviewId}/pdf`, '_blank');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Ошибка при скачивании PDF');
    }
  };
  
  const handleCloseResults = () => {
    setShowResults(false);
    navigate('/');
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingContainer>Загрузка вопросов...</LoadingContainer>
      </Container>
    );
  }
  
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : undefined;
  const answeredCount = answers.size;
  const progress = (answeredCount / questions.length) * 100;
  
  return (
    <Container>
      <Header>
        <Title>Техническое интервью</Title>
        <Subtitle>Ответьте на вопросы развернуто. ИИ оценит ваши ответы.</Subtitle>
      </Header>
      
      <Progress>
        <ProgressBar $width={progress} />
      </Progress>
      
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          onSubmit={handleSubmitAnswer}
          isSubmitting={submitting}
          feedback={currentAnswer?.feedback}
        />
      )}
      
      {showResults && results && (
        <ResultsModal
          results={results}
          onClose={handleCloseResults}
          onDownloadPDF={handleDownloadPDF}
        />
      )}
    </Container>
  );
};