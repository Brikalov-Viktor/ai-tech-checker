import styled from 'styled-components';
import { useAppSelector } from '../store/hooks';

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 16px;
`;

const WelcomeText = styled.p`
  color: #666;
  font-size: 18px;
  margin-bottom: 24px;
`;

const InfoCard = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 12px;
  margin-top: 24px;
`;

const InfoTitle = styled.h3`
  color: #667eea;
  margin-bottom: 12px;
`;

export const DashboardPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  
  return (
    <Container>
      <Title>Добро пожаловать, {user?.name}!</Title>
      <WelcomeText>
        Добро пожаловать в систему AI Tech Checker - автоматизированную проверку технических компетенций.
      </WelcomeText>
      
      <InfoCard>
        <InfoTitle>Ваш профиль</InfoTitle>
        <p><strong>Логин:</strong> {user?.login}</p>
        <p><strong>Роль:</strong> {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
        <p><strong>Уровень:</strong> {user?.grade || 'Не указан'}</p>
      </InfoCard>
    </Container>
  );
};