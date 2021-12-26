/* eslint-disable no-console */

import axios from 'axios';

export const fetchAsync = async endpoint => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
