/**
 * @format
 */

import 'react-native';
import React from 'react';
// import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import App from '../App/Containers/App';

it('renders correctly', () => {
  renderer.create(<App />);
  
});


