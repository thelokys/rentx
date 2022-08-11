import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Bullet } from '../../../components/Bullet'

import { Container, Header, Steps, Title, SubTitle, Form, FormTitle } from './styles';
import { BackButton } from '../../../components/BackButton';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import * as Yup from 'yup'

export const SignUpFirstStep = () => {
  const { goBack, navigate } = useNavigation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [driverLicense, setDriverLicense] = useState('')

  const handleBack = () => {
    goBack()
  }

  const handleNextStep = async () => {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required('CNH é obrigatória'),
        email: Yup.string().required('E-mail é inválido').email('E-mail é obrigatório'),
        name: Yup.string().required('Nome é obrigatório'),
      })

      const data = { name, email, driverLicense }
      await schema.validate(data)

      navigate("SignUpSecondStep", { user: data })
    } catch (error) {
      if(error instanceof Yup.ValidationError) {
        return Alert.alert('Opa', error.message)
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet active/>
              <Bullet />
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
            <FormTitle>1. Dados</FormTitle> 
            <Input
              iconName='user'
              placeholder="Nome"
              onChangeText={setName}
              value={name}
            />
            <Input
              iconName='mail'
              placeholder="E-mail"
              keyboardType='email-address'
              onChangeText={setEmail}
              value={email}
            />
            <Input
              iconName='credit-card'
              placeholder="CNH"
              keyboardType='numeric'
              onChangeText={setDriverLicense}
              value={driverLicense}
            />
          </Form>

          <Button
            title="Próximo"
            onPress={handleNextStep}
          />

        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
