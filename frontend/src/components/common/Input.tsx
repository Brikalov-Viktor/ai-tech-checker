import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const ErrorText = styled.span`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <StyledInput {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};