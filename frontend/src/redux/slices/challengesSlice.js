import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  challenges: [],
  isLoading: false,
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setChallenges: (state, action) => {
      state.challenges = action.payload;
    },
    addChallenge: (state, action) => {
      state.challenges.push(action.payload);
    },
    markDayCompleted: (state, action) => {
      const { challengeId, dateStr } = action.payload;
      const challenge = state.challenges.find(c => c.id === challengeId);
      if (challenge && !challenge.completedDates.includes(dateStr)) {
        challenge.completedDates.push(dateStr);
      }
    },
    removeChallenge: (state, action) => {
      state.challenges = state.challenges.filter(c => c.id !== action.payload);
    }
  },
});

export const { setChallenges, addChallenge, markDayCompleted, removeChallenge } = challengesSlice.actions;

export default challengesSlice.reducer;

// Thunks for persistence
export const loadChallenges = () => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem('@stride_challenges');
    if (data) {
      dispatch(setChallenges(JSON.parse(data)));
    }
  } catch (e) {
    console.error("Failed to load challenges", e);
  }
};

export const createNewChallenge = (title, totalDays) => async (dispatch, getState) => {
  const newChallenge = {
    id: Date.now().toString(),
    title,
    totalDays,
    startDate: new Date().toISOString(),
    completedDates: [],
    status: 'active',
  };
  dispatch(addChallenge(newChallenge));
  const { challenges } = getState().challenges;
  await AsyncStorage.setItem('@stride_challenges', JSON.stringify(challenges));
};

export const checkInChallengeDay = (challengeId, dateStr) => async (dispatch, getState) => {
  dispatch(markDayCompleted({ challengeId, dateStr }));
  const { challenges } = getState().challenges;
  await AsyncStorage.setItem('@stride_challenges', JSON.stringify(challenges));
};

export const deleteChallenge = (challengeId) => async (dispatch, getState) => {
  dispatch(removeChallenge(challengeId));
  const { challenges } = getState().challenges;
  await AsyncStorage.setItem('@stride_challenges', JSON.stringify(challenges));
};
