import type React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  text-transform: uppercase;
`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button text
   */
  children: string;
}

/**
 * Button component
 */
export default function Button({ children, ...props }: ButtonProps): React.ReactElement<ButtonProps> {
  return (
    <StyledButton type="button" {...props}>
      {children}
    </StyledButton>
  );
}
