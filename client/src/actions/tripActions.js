import ActionTypes from '../constants/ActionTypes';
import { push } from 'react-router-redux';
import axios from 'axios';

const getAllTrips = () => (dispatch, getState) => {
  const userId = getState().userReducer.currentUser.id;
  axios.get('/api/trips', {
    params: {
      userId,
    },
  })
    .then(({ data }) => {
      dispatch({
        type: ActionTypes.GET_ALL_TRIPS,
        code: data.rows,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};


const createTrip = data => (dispatch, getState) => {
  // console.log('in actions:', data)
  dispatch({
    type: ActionTypes.CREATE_TRIP,
    code: data,
  });
  axios.post('/api/newTrip', data)
    .then(() => axios.get('/api/tripId', { params: { id: data.ownerId } }))
    .then((response) => {
      // console.log('got new trip id: ', response);
      const newTripId = response.data.id;
      return axios.post('/api/usersByTrips', {
        newTripId,
        ownerId: data.ownerId,
      });
    })
    .then(() => {
      dispatch(getAllTrips(data.ownerId));
    })
    .catch((err) => {
      console.error(err);
    });
  dispatch(push('/home'));
};

const setCurrentTrip = item => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.SET_CURRENT_TRIP,
    code: item,
  });
  dispatch(push(`/trip/${item.user_id}`));
};

const deleteTrip = (tripId, userId) => (dispatch, getState) => {
  axios.delete('/api/trips', { data: { tripId } })
    .then(() => {
      dispatch(getAllTrips(userId));
    })
    .catch((err) => {
      console.error(err);
    });
};
const addMember = tripId => (dispatch, getState) => {
  const userId = getState().userReducer.currentUser.id;    
  axios.post('/api/trip/members', {
    params: {
      userId,
      tripId,
    },
  })
    .then(({ data }) => {      
      dispatch({
        type: ActionTypes.ADD_MEMBER,
        member: data,
      });
    });
};

const getTripMembers = () => (dispatch, getState) => {
  const tripId = getState().tripReducer.currentTrip.trip_id;
  axios.get('/api/trip/members', {
    params: {
      tripId,
    },
  })
    .then(({ data }) => {
      dispatch({
        type: ActionTypes.GET_TRIP_MEMBERS,
        members: data,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const deleteTripMember = memberId => (dispatch, getState) => {
  const tripId = getState().tripReducer.currentTrip.trip_id;
  axios.delete('/api/trip/members', {
    data: {
      memberId,
      tripId,
    },
  })
    .then(() => {
      dispatch(getTripMembers());
    })
    .catch((err) => {
      console.error(err);
    });
};


const getPendingInvites = () => (dispatch, getState) => {
  const userId = getState().userReducer.currentUser.id;
  const tripId = getState().tripReducer.currentTrip.trip_id;
  axios.get('/api/trip/invite', {
    params: {
      userId,
      tripId,
    },
  })
    .then(({ data }) => {
      dispatch({
        type: ActionTypes.GET_PENDING_INVITES,
        pendingInvites: data,
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendInvite = toEmail => (dispatch, getState) => {
  const { trip_id, city, owner_id } = getState().tripReducer.currentTrip;
  const { email, firstName } = getState().userReducer.currentUser;
  axios.post('/api/trip/invite', {
    params: {
      toEmail,
      trip_id,
      owner_id,
      email,
      firstName,
      city,
    },
  })
    .then(() => {
      dispatch(getPendingInvites());
    })
    .catch((err) => {
      console.error(err);
    });
};

const deleteInvite = email => (dispatch, getState) => {
  const { owner_id } = getState().tripReducer.currentTrip;
  const tripId = getState().tripReducer.currentTrip.trip_id;
  axios.delete('/api/trip/invite', {
    params: {
      email,
      tripId,
    },
  })
    .then(() => {
      dispatch(getPendingInvites());
    })
    .catch((error) => {
      console.error(error);
    });
};

const getActivitiesForDate = (date, trip) => (dispatch, getState) => {
  axios.get('/api/getActivities', { params: { date, trip } })
    .then((success) => {
      dispatch({
        type: ActionTypes.GET_ACTIVITIES,
        code: success.data.rows,
      });
    })
    .catch((err) => {
      console.error('couldnt get activities from db', err);
    });
};

const addActivityToItinerary = placeData => (dispatch, getState) => {
  console.log('place and time to add:', placeData);
  axios.post('/api/addActivity', { params: placeData })
    .then(() => {
      console.log('data and tripid:', placeData.activityDate, placeData.tripId)
      dispatch(getActivitiesForDate(placeData.activityDate, placeData.tripId));
      console.log('saved activity to db');
    })
    .catch((err) => {
      console.log('couldnt save activity:', err);
    });
};

const updateActivity = newData => (dispatch, getState) => {
  console.log('newData is...', newData);
  const {id, startTime, newActivityName, dateOfActivity, tripId } = newData;
  // console.log('id, start time, and newname:', id, startTime, newActivityName)
  console.log('date and tripid:', dateOfActivity, tripId)


  axios.post('/api/updateActivity', {params: {id, startTime, newActivityName}})
  .then(() => {
    dispatch(getActivitiesForDate(dateOfActivity, tripId))
    console.log('dispatched after updating');
  })
  .catch(err => {
    console.log('couldnt update activity:', err)
  })
}

const deleteActivity = deleteData => (dispatch, getState) => {
  const {id, dateOfActivity, tripId} = deleteData
  console.log('id to delete, dateofactivity, tripid:', id, dateOfActivity, tripId)
  axios.delete('/api/updateActivity', {params: {id}})
  .then(() => {
    dispatch(getActivitiesForDate(dateOfActivity, tripId))
  })
  .catch(err => {
    console.log('couldnt delete activity:', err)
  })
}

const upVote = upVoteData => (dispatch, getState) => {
  const {activityId, userId, tripId, activityDate} = upVoteData
  axios.post('/api/upVoteActivity', {params: {activityId, userId}})
  .then(() => {
    dispatch(getActivitiesForDate(activityDate, tripId))
  })
  .catch(err => {
    console.log('couldnt upVote activity:', err)
  })
}

const downVote = downVoteData => (dispatch, getState) => {
  const {activityId, userId, tripId, activityDate} = downVoteData
  axios.post('/api/downVoteActivity', {params: {activityId, userId}})
  .then(() => {
    dispatch(getActivitiesForDate(activityDate, tripId))
  })
  .catch(err => {
    console.log('couldnt downVote activity:', err)
  })
}

const getVotes = tripId

module.exports = {
  createTrip,
  getAllTrips,
  setCurrentTrip,
  deleteTrip,
  addMember,
  sendInvite,
  deleteInvite,
  getPendingInvites,
  getTripMembers,
  deleteTripMember,
  getActivitiesForDate,
  addActivityToItinerary,
  updateActivity,
  deleteActivity,
  upVote,
  downVote
};
