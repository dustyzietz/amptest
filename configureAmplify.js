import Amplify from 'aws-amplify'
import config from './aws-exports'
import { API, Auth } from 'aws-amplify'
API.configure(config)
Auth.configure(config)