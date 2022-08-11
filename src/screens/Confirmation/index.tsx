import React from 'react';

import { StatusBar, useWindowDimensions } from 'react-native'

import LogoSvg from '../../assets/logo_background_gray.svg'
import DoneSvg from '../../assets/done.svg'

import { ConfirmButton } from '../../components/ConfirmButton';

import { 
  Container,
  Title,
  Content,
  Message,
  Footer
} from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';


interface Params {
  title: string;
  message: string;
  nextScreenRoute: string
}

export const Confirmation = () => {
  const { width } = useWindowDimensions()
  const { navigate } = useNavigation()
  const route = useRoute()

  const { title, message, nextScreenRoute } = route.params as Params
    
  const handleConfirm = () => {
    navigate(nextScreenRoute as any)
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LogoSvg width={width}  />

      <Content>
        <DoneSvg width={80} height={80} />
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Content>

      <Footer>
        <ConfirmButton title="OK" onPress={handleConfirm} />
      </Footer>
    </Container>
  );
};
