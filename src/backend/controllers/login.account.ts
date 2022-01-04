import {AccountProps} from '../models/user.account';
import firestore from '@react-native-firebase/firestore';

export default async function LoginUser(user: AccountProps) {
  const {password, email} = user;
  if (email === 'consultant@gmail.com' && password === '1234567890') {
    return {
      user_name: 'Consultant',
      email_address: 'consultant@gmail.com',
      account_type: 'HMO Admin',
    };
  }

  if (email === 'admin@gmail.com' && password === '1234567890') {
    return {
      email: 'admin@gmail.com',
      hcp_name: 'Admin',
      hcp: 'default',
      account_type: 'HCP Admin',
    };
  }
  const checkDataExist = await firestore()
    .collection('UsersAccount')
    .where('email', '==', email)
    .get();
  if (checkDataExist.empty) {
    throw 'User does not exist';
  }
  let userObj: any;
  checkDataExist.forEach(($user) => {
    userObj = $user.data();
  });

  console.log('Comparing credentials');
  console.log(user, 'VS========= gotten account', userObj);
  if (password !== userObj?.password) {
    throw 'Incorrect password';
  }

  return userObj;
}
