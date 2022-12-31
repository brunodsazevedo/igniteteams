import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION, PLAYER_COLLECTION } from '../storageConfig';

import { groupsGetAll } from './groupsGetAll';

export async function groupRemoveByName(groupDelete: string) {
  try {
    const storedGroups = await groupsGetAll();
    const groups = storedGroups.filter(group => group !== groupDelete);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${GROUP_COLLECTION}`);
  } catch (error) {
    throw error
  }
}
