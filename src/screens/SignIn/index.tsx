import React, { useState } from 'react';
import { StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { useTheme } from 'styled-components/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import * as Yup from 'yup'


import { Container, Title, Header, SubTitle, Form, Footer } from './styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

export const SignIn = () => {
  const theme = useTheme()
  const { navigate } = useNavigation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async () => {
    const schema = Yup.object().shape({
      email: Yup.string().required('E-mail Obrigatório').email('Diigite um e-mail válido'),
      password: Yup.string().required('A senha é obrigatório')
    })

    try {
      await schema.validate({ email, password })
      Alert.alert('Tudo certo!')

      signIn({email, password})
    } catch (error) {
      if(error instanceof Yup.ValidationError) {
        return Alert.alert('Opa', error.message)
      } else {
        return Alert.alert(
          'Erro na autenticação',
          "Ocorreu um erro ao fazer login, verifique as credenciais"
        )
      }
    }
  }

  const handleNewAccount = () => {
    navigate('SignUpFirstStep')
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />

          <Header>
            <Title>Estamos{`\n`}quase lá.</Title>
            <SubTitle>
              Faça seu login para começar{`\n`}
              uma experiência incrível.
            </SubTitle>
          </Header>

          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />

            <PasswordInput
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
          </Form>

          <Footer>
              <Button 
                title="login"
                onPress={handleSignIn}
                enabled={true}
                loading={false}
              />
              <Button 
                title="Criar conta gratuita"
                onPress={handleNewAccount}
                color={theme.colors.bg_secondary}
                light
              />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
