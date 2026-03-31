import React from 'react';
import styled from 'styled-components';
import { RegisterForm } from '../components/auth/RegisterForm';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

export const RegisterPage: React.FC = () => {
  return (
    <Container>
      <RegisterForm onSwitchToLogin={() => {}} />
    </Container>
  );
};