import React, { useState } from 'react';
import {Feather} from '@expo/vector-icons'
import { useTheme } from 'styled-components/native';

import { Container, InputText, IconContainer } from './styles';
import { TextInputProps } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name']
  value?: string
}

export const PasswordInput = ({
  iconName,
  value,
  ...rest
}: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] =useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const theme = useTheme()

  const handlePasswordVisibilityChange = () => {
    setIsPasswordVisible(prevState => !prevState)
  }

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
        secureTextEntry={!isPasswordVisible}
        {...rest}
      />

      <BorderlessButton onPress={handlePasswordVisibilityChange}>
        <IconContainer>
          <Feather
            name={isPasswordVisible ? "eye-off": "eye"}
            size={24}
            color={theme.colors.text_detail}
          />
        </IconContainer>
      </BorderlessButton>
    </Container>
  );
};
