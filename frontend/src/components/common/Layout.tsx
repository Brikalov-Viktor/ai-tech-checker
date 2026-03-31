import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Button } from './Button';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const Content = styled.main`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <Container>
      <Header>
        <Logo>AI Tech Checker</Logo>
        {user && (
          <UserInfo>
            <UserName>{user.name}</UserName>
            <Button variant="secondary" onClick={handleLogout}>
              Выйти
            </Button>
          </UserInfo>
        )}
      </Header>
      <Content>{children}</Content>
    </Container>
  );
};