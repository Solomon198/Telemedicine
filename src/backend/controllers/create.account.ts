import {AccountProps} from '../models/user.account';
import firestore from '@react-native-firebase/firestore';

export default async function CreateUser(user: AccountProps) {
  const {hcp, other_name, family_name, password, email} = user;
  const ID = new Date().getTime().toString();
  const checkDataExist = await firestore()
    .collection('UsersAccount')
    .where('email', '==', email)
    .get();
  console.log(checkDataExist.empty, checkDataExist.size);
  if (!checkDataExist.empty) {
    throw 'Email Exist';
  }
  try {
    const firestoreData = await firestore().collection('UsersAccount').add({
      other_name,
      family_name,
      password,
      hcp,
      enrolee_id: ID,
      email,
      account_type: 'Enrolee',
    });
    console.log(firestoreData);
    return firestoreData;
  } catch (e) {
    throw e.message;
  }
}
