import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

import {Feather} from '@expo/vector-icons'

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

  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,

  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,

  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from './styles';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { format } from 'date-fns';
import { getPlataformDate } from '../../utils/getPlatformDate';
import { api } from '../../services/api';
import { Alert } from 'react-native';

interface Params {
  car: CarDTO
  dates: string[]
}

interface RentalPeriod {
  start: string
  end: string
}

export const SchedulingDetails = () => {
  const [rentalPeriod, setRentalPeriod] = useState({} as RentalPeriod)
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const route = useRoute()
  const { car, dates } = route.params as Params

  const rentTotal = Number(dates.length) * car.rent.price

  const { navigate, goBack } = useNavigation()
    
  const handleConfirmRental = async () => {
    setLoading(true)

    let schedulesByCar;
    try {  
      schedulesByCar = await api.get(`/schedules_bycars/${car.id}`)  
    } catch (error) {
      setLoading(false) 
      Alert.alert('Não foi possível confirmar a data selecionada, tente novamente mais tarde')
      return
    }

    const { unavailable_dates } = schedulesByCar.data
    
    const unavailableDates = [
      ...unavailable_dates,
      ...dates,
    ]

    await api.post('schedules_byuser', {
      user_id: 1,
      car,
      startDate: format(getPlataformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endDate: format(getPlataformDate(new Date(dates[dates.length-1])), 'dd/MM/yyyy')
    })

    api.put(`/schedules_bycars/${car.id}`, {
      id: car.id,
      unavailable_dates: unavailableDates
    })
    .then(() => navigate('Confirmation', {
      title: 'Carro Alugado!',
      message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel`,
      nextScreenRoute: 'Home'
    }))
    .catch(() =>{
      setLoading(false)
      Alert.alert("Não foi possível confirmar o agendamento.")
    })
    
   
  }

  const handleBack = () => {
    goBack()
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlataformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end: format(getPlataformDate(new Date(dates[dates.length-1])), 'dd/MM/yyyy')
    })
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBack} />
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={car.photos} />
      </CarImages>

      <Content>
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

        <RentalPeriod>
          <CalendarIcon>
            <Feather 
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather 
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>

        </RentalPeriod>
      
        <RentalPrice>
          <RentalPriceLabel>Total</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>R$ {car.rent.price} x {dates.length} diárias</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button 
          title="Alugar agora"
          color={theme.colors.succeess} 
          onPress={handleConfirmRental}
          loading={loading}
          enabled={!loading}
        />
      </Footer>
    </Container>
  );
};
