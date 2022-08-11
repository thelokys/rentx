import React from 'react';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';

import speedSvg from '../../assets/speed.svg';
import accelerationSvg from '../../assets/acceleration.svg';
import forceSvg from '../../assets/force.svg';
import gasolineSvg from '../../assets/gasoline.svg';
import exchangeSvg from '../../assets/exchange.svg';
import peopleSvg from '../../assets/people.svg';

import { 
  Container, 
  Header, 
  CarImages,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer,
} from './styles';
import { Button } from '../../components/Button';

import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { StatusBar, StyleSheet } from 'react-native';

import { useTheme } from 'styled-components/native';

interface Params {
  car: CarDTO
}

export const CarDetails = () => {
  const { navigate, goBack } = useNavigation()
  const theme = useTheme()

  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y
  })

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: 
        interpolate(scrollY.value,
          [0, 200],
          [200, 70],
          Extrapolate.CLAMP
        )
    }
  })

  const slideCarStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value,[0,150],[1,0], Extrapolate.CLAMP)
    }
  })

  const route = useRoute()
  const { car } = route.params as Params

  const handleConfirmRental = () => {
    navigate('Scheduling', { car })
  }

  const handleBack = () => {
    goBack()
  }

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Animated.View style={[
          headerStyleAnimation,
          styles.header,
          { backgroundColor: theme.colors.bg_secondary}
        ]}>
        <Header>
          <BackButton onPress={handleBack} />
        </Header>

        <CarImages>
          <Animated.View style={slideCarStyleAnimation}>
              <ImageSlider imagesUrl={car.photos} />
          </Animated.View>
        </CarImages>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={ {
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight() + 160,
          alignItems: 'center'
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {
            car.accessories.map(accessory => (
              <Accessory 
                key={accessory.type} 
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>

        <About>{car.about}</About>
        <About>{car.about}</About>
        <About>{car.about}</About>
        <About>{car.about}</About>
        <About>{car.about}</About>
      </Animated.ScrollView>

      <Footer>
        <Button title="Escolher período do aluguel" onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1
  }
})