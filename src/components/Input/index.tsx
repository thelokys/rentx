import React, { useState } from 'react';
import {Feather} from '@expo/vector-icons'
import { useTheme } from 'styled-components/native';

import { Container, InputText, IconContainer } from './styles';
import { TextInputProps, Alert } from 'react-native';

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name']
  value?: string
}

export const Input = ({
  iconName,
  value,
  ...rest
}: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const theme = useTheme()

  const handleIsFocused = () => {
    setIsFocused(true)
  }

  const handleIsFilled= () => {
    setIsFocused(false)
    setIsFilled(!!value) 
  }

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={iconName}
          size={24}
          color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
        />
      </IconContainer>
      <InputText 
        isFocused={isFocused}
        onFocus={handleIsFocused}
        onBlur={handleIsFilled}
        {...rest} 
      />
    </Container>
  );
};
