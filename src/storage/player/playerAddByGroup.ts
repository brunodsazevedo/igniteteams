import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from '../storageConfig';
import { AppError } from '@utils/AppError';

import { playersGetByGroup } from './playersGetByGroup';
import { PlayerStorageDTO } from './PlayerStorageDTO';

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storedPlayers = await playersGetByGroup(group);

    const playerAlreadyExist = storedPlayers.filter(player => player.name === newPlayer.name);

    if(playerAlreadyExist.length > 0) {
      throw new AppError('Essa pessoa já está cadastrada em um time aqui.');
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer]);
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
  } catch (error) {
    throw error;
  }
}
