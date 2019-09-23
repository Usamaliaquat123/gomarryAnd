
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import bgMessaging from './App/Containers/bgMessaging';



AppRegistry.registerComponent('gomarry', () => App)
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line