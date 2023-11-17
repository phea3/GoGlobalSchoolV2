import AsyncStorage from "@react-native-async-storage/async-storage";

interface userLogin {
  _id: string;
  firstName: string;
  lastName: string;
  englishName: string;
  profileImg: string;
}

export const initMobileUserLogin: userLogin = {
  _id: "",
  firstName: "",
  lastName: "",
  englishName: "",
  profileImg: "",
};

export async function fetchDataLocalStorage(keyword: string) {
  const result = await Promise.resolve(AsyncStorage.getItem(keyword));
  if (result) {
    return result;
  } else {
    return `{"__typename":"MobileUserLogin","_id":"","firstName":"","lastName":"","englishName":"","profileImg":""}`;
  }
}
