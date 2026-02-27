import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const RootStack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}


// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/Feed/HomeScreen';
// import SearchScreen from '../screens/Search/SearchScreen';
// import FriendsScreen from '../screens/Friends/FriendsScreen';
// import SavedScreen from '../screens/Saved/SavedScreen';
// import RankingScreen from '../screens/Ranking/RankingScreen';
// import ProfileScreen from '../screens/Profile/ProfileScreen';

// const Tab = createBottomTabNavigator();

// export default function MainNavigator() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Search" component={SearchScreen} />
//       <Tab.Screen name="Friends" component={FriendsScreen} />
//       <Tab.Screen name="Saved" component={SavedScreen} />
//       <Tab.Screen name="Ranking" component={RankingScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }