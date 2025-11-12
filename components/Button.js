import styled, {css} from "styled-components";
import {primary} from "@/lib/colors";

export const ButtonStyle = css`
  border:0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight:500;
  svg{
    height: 16px;
    margin-right: 5px;
  }
  ${props => props.block && css`
    display: block;
    width: 100%;
  `}
  ${props => props.white && !props.outline && css`
    background-color: #fff;
    color: #000;
  `}
  ${props => props.white && props.outline && css`
    background-color: transparent;
    color: #fff;
    border: 1px solid #fff;
  `}
  ${props => props.black && !props.outline && css`
    background-color: #000;
    color: #fff;
  `}
  ${props => props.black && props.outline && css`
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
  `}
  ${props => props.primary && !props.outline && css`
    background-color: ${primary};
    border: 1px solid ${primary};
    color:#fff;
  `}
  ${props => props.primary && props.outline && css`
    background-color: transparent;
    border: 1px solid ${primary};
    color:${primary};
  `}
  ${props => props.size === 'l' && css`
    font-size:1.2rem;
    padding: 10px 20px;
    svg{
      height: 20px;
    }
  `}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    ${props => props.white && !props.outline && css`
      background-color: #f5f5f5;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `}
    ${props => props.white && props.outline && css`
      background-color: rgba(255, 255, 255, 0.1);
      border-color: #fff;
    `}
    ${props => props.black && !props.outline && css`
      background-color: #333;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `}
    ${props => props.black && props.outline && css`
      background-color: rgba(0, 0, 0, 0.05);
      border-color: #333;
    `}
    ${props => props.primary && !props.outline && css`
      background-color: ${primary};
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `}
    ${props => props.primary && props.outline && css`
      background-color: ${primary};
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `}
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function Button({children,...rest}) {
  return (
    <StyledButton {...rest}>{children}</StyledButton>
  );
}