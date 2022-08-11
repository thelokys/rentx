import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useTheme } from 'styled-components/native';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';
import { AntDesign } from '@expo/vector-icons'

import { Container,
  Title,
  Header,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsAmount,

  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
  
} from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string
}

export const MyCars = () => {
  const { goBack } = useNavigation()
  const theme = useTheme()

  const [cars, setCars] = useState<CarProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get<CarProps[]>('/schedules_byuser?user_id=1')
        setCars(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()

  },[])

  const handleBack = () => {
    goBack();
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

        <SubTitle>
          Conforto, segurança e praticidade
        </SubTitle>
      </Header>


      {
        loading
        ? <LoadAnimation />
        :
          <Content>
            <Appointments>
              <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
              <AppointmentsAmount>{cars.length}</AppointmentsAmount>
            </Appointments>

            <FlatList
              data={cars}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <CarWrapper>
                    <Car data={item.car} />
                    <CarFooter>
                      <CarFooterTitle>Período</CarFooterTitle>
                      <CarFooterPeriod>
                        <CarFooterDate>{item.startDate}</CarFooterDate>
                        <AntDesign
                          name="arrowright"
                          size={20}
                          color={theme.colors.title}
                          style={{ marginHorizontal: 10 }}
                        />
                        <CarFooterDate>{item.endDate}</CarFooterDate>
                      </CarFooterPeriod>
                  </CarFooter>
                </CarWrapper>
              )}
            />
          </Content>
      }
    </Container>
  );
};
