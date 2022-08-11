import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { BackButton } from '../../components/BackButton';

import ArrowSvg from '../../assets/arrow.svg';

import { 
  Container,
  Title,
  Header,

  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  DateValueContainer,
  Content,
  Footer

} from './styles';
import { Alert, StatusBar } from 'react-native';
import { Button } from '../../components/Button';
import { Calendar, DayProps, MarkedDateProps } from '../../components/Calendar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateInterval } from '../../components/Calendar/generateInterval';
import { format } from 'date-fns';
import { getPlataformDate } from '../../utils/getPlatformDate';
import { CarDTO } from '../../dtos/CarDTO';


interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params {
  car: CarDTO
}

export const Scheduling = () => {

  const [lastSelectedDate, setLastSelectedDate] = useState({} as DayProps)
  const [markedDates, setMarkedDates] = useState({} as MarkedDateProps)
  const [rentalPeriod, setRentalPeriod] = useState({} as RentalPeriod)
  
  const theme = useTheme()

  const route = useRoute()
  const { car } = route.params as Params

  const { navigate, goBack } = useNavigation()
    
  const handleConfirmRental = () => {
    navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates)
    })
  }

  const handleBack = () => {
    goBack()
  }

  const handleChangeDate = (date: DayProps) => {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate 
    let end = date

    if(start.timestamp > end.timestamp) {
      start = end
      end = start
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end)
    setMarkedDates(interval)

    const dateKeyInterval = Object.keys(interval) 

    const startDate = dateKeyInterval[0]
    const endDate = dateKeyInterval[dateKeyInterval.length - 1]

    setRentalPeriod({
      startFormatted: format(getPlataformDate(new Date(startDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlataformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
  }

  return (
    <Container>
      <Header>
        <StatusBar 
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton onPress={handleBack} color={theme.colors.shape} />

        <Title>
          Escolha uma {'\n'}
          data de inicio e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValueContainer selected={!!rentalPeriod.startFormatted}>
              <DateValue>{rentalPeriod.startFormatted}</DateValue>
            </DateValueContainer>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATE</DateTitle>
            <DateValueContainer selected={!!rentalPeriod.endFormatted}>
              <DateValue>{rentalPeriod.endFormatted}</DateValue>
            </DateValueContainer>
          </DateInfo>
          
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar markedDates={markedDates} onDayPress={handleChangeDate as any} />
      </Content>

      <Footer>
        <Button 
          title="Confirmar" 
          enabled={!!rentalPeriod.endFormatted} 
          onPress={handleConfirmRental}
        />
      </Footer>

    </Container>
  );
};
