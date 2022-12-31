import React, { useState, useRef, useEffect } from 'react';
import { Alert, FlatList, TextInput, Keyboard } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';

import { AppError } from '@utils/AppError';

import {
  Container,
  Form,
  HeaderList,
  NumbersOfPlayers,
} from './styles';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

type Params = {
  group: string;
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const route = useRoute();
  const navigation = useNavigation();

  const { group } = route.params as Params;

  async function handleAddPlayer() {
    try {
      if(newPlayerName.trim().length === 0) {
        return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar');
      }

      const newPlayer = {
        name: newPlayerName,
        team,
      }

      await playerAddByGroup(newPlayer, group);
      fetchPlayersByTeam();

      newPlayerNameInputRef.current?.blur();
      Keyboard.dismiss();
      setNewPlayerName('');
    } catch (error) {
      if(error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message);
        return;
      }

      Alert.alert('Nova pessoa', 'Não foi possível adicionar');
      console.log(error);
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert('Remover pessoa', 'Não foi possível remover a pessoa selecionada');
    }
  }

  async function handleGroupRemove() {
    try {
      Alert.alert(
        'Remover',
        'Deseja remover o grupo?',
        [
          { text: 'Não', style: 'cancel' },
          { text: 'Sim', onPress:() => groupRemove() }
        ]
      )
    } catch (error) {
      
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Remover grupo', 'Não foi possível remover o grupo');
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);

      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado');
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
          placeholder="Nome da pessoa"
          autoCorrect={false}
        />

        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />

      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
            )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>

      {isLoading ? <Loading /> : (
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handleRemovePlayer(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty
              message="Não há pessoas nesse time"
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  );
}
