import {Navigation} from 'react-native-navigation';

export function DefaultNavSettingStack() {
  return Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'stack.auto.switch',
            },
          },
        ],
      },
    },
  });
}

export function AuthNavigationSettingStack() {
  return Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'stack.auth.login',
            },
          },
        ],
      },
    },
  });
}

export function HMO_Dashboard() {
  return Navigation.setRoot({
    root: {
      // sideMenu: {
      //   center: {
      stack: {
        id: 'stack.hmo.center',
        children: [
          {
            component: {
              name: 'stack.hmo.dashboard',
              id: 'stack.hmo.dashboard',
            },
          },
        ],
      },
      // },

      //   left: {
      //     component: {
      //       name: 'stack.hmo.sidemenu',
      //     },
      //   },
      //  },
    },
  });
}

export function HCP_Dashboard() {
  return Navigation.setRoot({
    root: {
      // sideMenu: {
      //   center: {
      stack: {
        id: 'stack.hcp.center',
        children: [
          {
            component: {
              name: 'stack.hcp.dashboard',
              id: 'stack.hcp.dashboard',
            },
          },
        ],
      },
      //   },

      //   left: {
      //     component: {
      //       name: 'stack.hcp.sidemenu',
      //     },
      //   },
      // },
    },
  });
}

export function User() {
  return Navigation.setRoot({
    root: {
      sideMenu: {
        center: {
          stack: {
            id: 'stack.user.center',
            children: [
              {
                component: {
                  name: 'stack.user.dashboard',
                  id: 'stack.user.dashboard',
                },
              },
            ],
          },
        },

        left: {
          component: {
            name: 'stack.user.sidemenu',
          },
        },
      },
    },
  });
}
