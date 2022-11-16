/**
 *
 * Index.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * Index.js is the running point for the application.
 * As it uses expo features, the
 * root component, App, must be registered
 *
 * */
import { registerRootComponent } from 'expo';

import React from 'react';
import { View } from 'react-native';

import App from '/Users/meganpowers/re_celler/mobile/App.js';

registerRootComponent(App);
