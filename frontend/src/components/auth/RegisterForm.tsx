import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register } from '../../store/slices/authSlice';
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

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [name, setName] = useState('');
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    setPasswordError('');
    
    if (name && loginValue && password) {
      await dispatch(register({ name, login: loginValue, password }));
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Title>Регистрация</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Input
        label="Имя"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={isLoading}
      />
      
      <Input
        label="Логин"
        type="text"
        value={loginValue}
        onChange={(e) => setLoginValue(e.target.value)}
        required
        disabled={isLoading}
        style={{ marginTop: 16 }}
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
      
      <Input
        label="Подтверждение пароля"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={isLoading}
        error={passwordError}
        style={{ marginTop: 16 }}
      />
      
      <StyledButton type="submit" disabled={isLoading}>
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </StyledButton>
      
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button type="button" variant="secondary" onClick={onSwitchToLogin}>
          Уже есть аккаунт? Войти
        </Button>
      </div>
    </Form>
  );
};