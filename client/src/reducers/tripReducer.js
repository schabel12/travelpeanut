import ActionTypes from '../constants/ActionTypes'
import { updateObject, createReducer } from'./reducerUtils'

// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY

const initialState = {
  allTrips: [],
  currentTrip: {},
  currentDay: {},
  temp: {},
<<<<<<< HEAD
  tripCoordinates: {},
=======
>>>>>>> 5c795e607d272eaadcd6dabab7170534bd2f077f
  tripMembers: []
}

const tripReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_TRIP':
      return Object.assign({}, state, {
        temp: action.code
      })
    case 'GET_ALL_TRIPS':
      return Object.assign({}, state, {
        allTrips: action.code
      })
    case 'SET_CURRENT_TRIP':
      console.log(action.code)
      return Object.assign({}, state, {
        currentTrip: action.code
      })
<<<<<<< HEAD
    case 'STORE_CITY_LOCATION':
      return Object.assign({}, state, {
        tripCoordinates: action.code
      })
=======
>>>>>>> 5c795e607d272eaadcd6dabab7170534bd2f077f
    case 'ADD_MEMBER':
      return {...state,
        tripMembers: [
          ...state.tripMembers, 
          action.member
      ]}
    case 'GET_TRIP_MEMBERS': 
      return {...state,
        tripMembers: action.members
      }
    default:
      return Object.assign({}, state)
  }
}

export default tripReducer
