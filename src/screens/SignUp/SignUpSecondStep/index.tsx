import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Bullet } from '../../../components/Bullet'

import { Container, Header, Steps, Title, SubTitle, Form, FormTitle } from './styles';
import { BackButton } from '../../../components/BackButton';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput';
import { useTheme } from 'styled-components/native';
import { Confirmation } from '../../Confirmation'

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  }
}

export const SignUpSecondStep = () => {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')


  const { goBack, navigate } = useNavigation()
  const route = useRoute()
  const theme = useTheme()

  const { user } = route.params as Params;

  const handleBack = () => {
    goBack()
  }

  const handleRegister = () => {
    if(!password || !passwordConfirm) {
      return Alert.alert('Informe a senha e a confirmação.')
    }

    if(password != passwordConfirm) {
      return Alert.alert('As senhas não são iguais.')
    }
    
    navigate('Confirmation', {
      title: 'Conta Criada!',
      message: `Agora é só fazer login\ne aproveitar.`,
      nextScreenRoute: 'SignIn'
    })
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet />
              <Bullet active/>
            </Steps>
          </Header>

          <Title>
            Crie sua{`\n`}conta
          </Title>
          <SubTitle>
            Faça seu cadastro de{`\n`}
            Form Rápida e fácil
          </SubTitle>

          <Form>
            <FormTitle>2. Senha</FormTitle> 
            <PasswordInput 
              iconName='lock' 
              placeholder='Senha'
              onChangeText={setPassword}
              value={password}
            />

            <PasswordInput 
              iconName='lock' 
              placeholder='Repetir Senha'
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
           
          </Form>

          <Button
            title="Cadastrar"
            onPress={handleRegister}
            color={theme.colors.succeess}
          />

        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
