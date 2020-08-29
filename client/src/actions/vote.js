import axios from 'axios';
import { setAlert } from './alert'
import {
    VOTE_SUCCESS,
    ALREADY_VOTED
} from './types';

import setAuthToken from '../utils/setAuthToken';

export const vote =    