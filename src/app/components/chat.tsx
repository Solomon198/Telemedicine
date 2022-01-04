import React from 'react';
import {View} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import Colors from '../../configs/styles/index';
import {User} from '../utils/types';
import firestore from '@react-native-firebase/firestore';
import typography from 'react-native-ui-lib/generatedTypes/style/typography';

type Props = {
  user: User;
  isHmo: boolean;
};
class ChatScreen extends React.Component<Props> {
  constructor(props: any) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
  }

  ref = firestore().collection('ChatList');
  writeRef = firestore()
    .collection('ChatList')
    .doc('Hmo')
    .collection(this.props.user.enrolee_id);
  readRef = firestore()
    .collection('ChatList')
    .doc('Hmo')
    .collection(this.props.user.enrolee_id)
    .limit(50)
    .orderBy('createdAt', 'desc');
  watchRef: any;

  componentDidMount() {
    this.watchRef = this.readRef.onSnapshot((snapshot) => {
      let messages: any[] = [];
      snapshot.forEach((val) => {
        let obj = val.data();
        try {
          obj.createdAt = obj.createdAt.toDate();
        } catch (e) {}
        messages.push(obj);
      });
      this.setState({messages});
    });
    this.ref.get().then((snapshot) => {
      if (snapshot.empty) {
        this.ref.doc(this.props.user.enrolee_id).set({
          ...this.props.user,
          count: 0,
          userCount: 0,
          lastMessage: '',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.props.isHmo) {
      this.ref.doc(this.props.user.enrolee_id).update({
        count: 0,
      });
    } else {
      this.ref.doc(this.props.user.enrolee_id).update({
        userCount: 0,
      });
    }
    try {
      this.watchRef();
    } catch (e) {}
  }

  onSend(messages = []) {
    let message: any[] = messages;
    message[0].createdAt = firestore.FieldValue.serverTimestamp();
    message[0].user._id = this.props.isHmo ? 'Hmo' : this.props.user.enrolee_id;

    this.writeRef.add(messages[0]);
    if (this.props.isHmo) {
      this.ref.doc(this.props.user.enrolee_id).update({
        userCount: firestore.FieldValue.increment(1),
      });
    } else {
      this.ref.doc(this.props.user.enrolee_id).update({
        lastMessage: message[0].text,
        count: firestore.FieldValue.increment(1),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    // this.setState((previousState) => {
    //   return {
    //     messages: GiftedChat.append(previousState.messages, messages),
    //   };
    // });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          renderAvatar={null}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: '#f4f4f4',
                },
                right: {
                  backgroundColor: Colors.Brand.brandColor,
                },
              }}
            />
          )}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          user={{
            _id: this.props.isHmo ? 'Hmo' : this.props.user.enrolee_id,
          }}
        />
      </View>
    );
  }
}

export default ChatScreen;
