import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, BackHandler } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize'
import Logo from '../../assets/logo.svg'
import { Car } from '../../components/Car';
import { api } from '../../services/api'
import { CarDTO } from '../../dtos/CarDTO'
import { Container, Header, TotalCars, HeaderContent, CarList } from './styles';
import { Load } from '../../components/Load';
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native';

import { RectButton, PanGestureHandler } from 'react-native-gesture-handler'

import Animated, {  
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated'
import { LoadAnimation } from '../../components/LoadAnimation';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton)

export const Home = () => {
  const theme = useTheme()
  const { navigate } = useNavigation()

  const positionX = useSharedValue(0)
  const positionY = useSharedValue(0)

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
      { translateX: positionY.value },
      { translateY: positionY.value },
      ]
    }
  }) 

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, context: any) {
      context.positionX  = positionX.value
      context.positionY  = positionY.value
    },
    onActive(event, context: any){
      positionX.value = context.positionX + event.translationX
      positionY.value = context.positionY + event.translationY
    },
    onEnd(){
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    }
  })

  const [cars, setCars] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(true)
  
  const handleCarDetails = (car: CarDTO) => {
    navigate('CarDetails', { car })
  }
    
  const handleOpenMyCars = () => {
    navigate('MyCars')
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    } 
    fetchCars()   
  }, [])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => { return true })
  },[])

  return (
    <Container>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          {
            !loading && (
              <TotalCars>Total de {cars.length} carros</TotalCars>
            )
          }
        </HeaderContent>
      </Header>
  
      { 
          loading
        ? <LoadAnimation /> 
        : <CarList 
            data={cars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => 
              <Car 
                data={item} 
                onPress={() => handleCarDetails(item)} 
              />
            } 
          /> 
      }


      {
        !loading && (
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View
              style={[myCarsButtonStyle, {
                position: 'absolute',
                bottom: 23,
                right: 22
              }]}
            >
              <ButtonAnimated onPress={handleOpenMyCars} style={[styles.button, {backgroundColor: theme.colors.main}]}>
                <Ionicons name="ios-car-sport" size={24} color={theme.colors.shape} />
              </ButtonAnimated>
            </Animated.View>
          </ PanGestureHandler>
        )
      }
    </Container>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})