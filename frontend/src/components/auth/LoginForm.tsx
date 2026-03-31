import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const Form = styled.form`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 32px;
  color: #333;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #f44336;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
`;

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginValue && password) {
      await dispatch(login({ login: loginValue, password }));
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Title>Вход в систему</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Input
        label="Логин"
        type="text"
        value={loginValue}
        onChange={(e) => setLoginValue(e.target.value)}
        required
        disabled={isLoading}
      />
      
      <Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        style={{ marginTop: 16 }}
      />
      
      <StyledButton type="submit" disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </StyledButton>
      
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button type="button" variant="secondary" onClick={onSwitchToRegister}>
          Нет аккаунта? Зарегистрироваться
        </Button>
      </div>
    </Form>
  );
};