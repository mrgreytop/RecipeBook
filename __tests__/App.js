import 'react-native';
import React from 'react';
import App from '../App.tsx';

// // Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// TODO test recipes are loaded onto homepage
// TODO test new recipe form works in trivial case
// TODO test recipe form validation
// TODO test recipe form ingredient validation
// TODO test ingredient parsing
// TODO test new recipes show on homepage after one is added
// TODO test editted recipes are changed on homepage


it('renders correctly', () => {
  renderer.create(<App />);
});
