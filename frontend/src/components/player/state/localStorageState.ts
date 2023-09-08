
const playerStateName = 'playerState';
const booksStateName = 'booksState';

const parseSavedState = (name: string) => {
  const state = localStorage.getItem(name);
  if (!state) return {};
  try {
    const parsedState = JSON.parse(state);
    if (!parsedState || typeof parsedState !== 'object') return {};
    return parsedState;
  } catch (e) {
    console.error(`Can't parse ${name}`, e);
    return {};
  }
};

const updateBookState = (
  bookId: string,
  currentChapter: number,
  position: number,
  newBookState?: { bookId: string; currentChapter: number; position: number }
) => {
  const state = parseSavedState(booksStateName);
  const updated = new Date().toISOString();
  state[bookId] = { currentChapter, position, updated };
  if (newBookState) {
    const { bookId, currentChapter, position } = newBookState;
    state[bookId] = { currentChapter, position, updated };
  }
  localStorage.setItem(booksStateName, JSON.stringify(state));
};

const loadSavedState = (bookId: string) => {
  const state = parseSavedState(playerStateName);
  if (!state.bookId || state.bookId !== bookId) {
    const booksState = parseSavedState(booksStateName);
    if (state.bookId && (state.currentChapter || state.position)) {
      updateBookState(state.bookId, state.currentChapter, state.position);
    }
    if (booksState[bookId] && typeof booksState[bookId] === 'object') {
      state.currentChapter = booksState[bookId].currentChapter;
      state.position = booksState[bookId].position;
    } else {
      delete state.currentChapter;
      delete state.position;
    }
  }
  return state;
};

// export const getSavedState = (initialState: PlayerState, bookId: string, chaptersLength: number) => {
//   const state = { ...initialState };
//   const { currentChapter, position, volume, resetSleepTimerOnActivity, preventScreenLock } = loadSavedState(bookId);

//   if (isFinite(volume) && volume >= 0 && volume <= 100) {
//     state.volume = volume;
//   }

//   if (typeof preventScreenLock === 'boolean') {
//     state.preventScreenLock = preventScreenLock;
//   }

//   if (typeof resetSleepTimerOnActivity === 'boolean') {
//     state.resetSleepTimerOnActivity = resetSleepTimerOnActivity;
//   }

//   if (Number.isInteger(currentChapter) && currentChapter > 0 && currentChapter < chaptersLength) {
//     state.currentChapter = currentChapter;
//   }

//   if (isFinite(position) && position > 0) {
//     state.position = position;
//   }

//   return state;
// };

// export const useSaveState = (state: PlayerState, bookId: string) => {
//   const {
//     currentChapter,
//     position,
//     volume,
//     resetSleepTimerOnActivity,
//     preventScreenLock,
//     updateBookState: newBookState,
//   } = state;
//   useEffect(() => {
//     localStorage.setItem(
//       playerStateName,
//       JSON.stringify({
//         bookId,
//         currentChapter,
//         position,
//         volume,
//         resetSleepTimerOnActivity,
//         preventScreenLock,
//         updated: new Date().toISOString(),
//       })
//     );
//     updateBookState(bookId, currentChapter, position, newBookState);
//   }, [bookId, currentChapter, position, volume, resetSleepTimerOnActivity, preventScreenLock, newBookState]);
// };
