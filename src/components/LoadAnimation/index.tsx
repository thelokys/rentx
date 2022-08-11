import React from 'react';

import LottieView from 'lottie-react-native'

import loadingCar from '../../assets/loadingCar.json'

import { 
  Container,
  Title,
} from './styles';

export const LoadAnimation = () => {
  return (
    <Container>
      <LottieView source={loadingCar} autoPlay style={{
        height: 200
      }} 
      resizeMode="contain"
      loop
      />
    </Container>
  );
};
