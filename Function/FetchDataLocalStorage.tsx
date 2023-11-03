import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchDataLocalStorage(keyword: string) {
  const result = await Promise.resolve(AsyncStorage.getItem(keyword));
  if (result) {
    return result;
  } else {
    return "";
  }
}
