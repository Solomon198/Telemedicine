import {connect} from 'mongoose';

const DB_NAME = 'Consultant';
const DB_PASSWORD = 'wyJqzf1doMgBZald';
const DB_USER = 'Campus-Shopping';

connect(
  `mongodb+srv://${DB_USER}:${DB_PASSWORD}@jobworld.bb7uz.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   keepAlive: true,
    //   useUnifiedTopology: true,
    //   keepAliveInitialDelay: 450000,
    keepAlive: true,
    keepAliveInitialDelay: 450000,
    autoIndex: true,
  },
);
