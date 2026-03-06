import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Feed/HomeScreen";
import ChatScreen from "../screens/Chat/ChatScreen";
// import SearchScreen from '../screens/Search/SearchScreen';
// import FriendsScreen from '../screens/Friends/FriendsScreen';
// import SavedScreen from '../screens/Saved/SavedScreen';
// import RankingScreen from '../screens/Ranking/RankingScreen';
// import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createStackNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}
