export const API_AUTH_SIGN_UP = '/v1/auth/sign-up';
export const API_USERS_ME = '/v1/users/me';
export const API_USERS_KEEP_ALIVE = '/v1/users/:id/keep-alive';
export const API_USERS_READY = '/v1/users/:id/ready';
export const API_USERS_PROGRESS = '/v1/users/:id/progress';
export const API_ROOMS = '/v1/rooms';
export const API_ROOMS_ONLINE = '/v1/rooms/:id/online';
export const API_ROOMS_JOIN = '/v1/rooms/join';
export const API_ROOMS_START = '/v1/rooms/:id/start';
export const API_ROOMS_LEAVE = '/v1/rooms/:id/leave';
export const API_SCORES_USERS = '/v1/scores/users';
export const API_SCORES_USERS_GROUPED = '/v1/scores/users/grouped';
export const API_EPISODES = '/v1/episodes';
export const API_SCORES_ROOMS = '/v1/scores/rooms';
export const API_SCORES_CATEGORIES = '/v1/scores/categories';
export const API_FEEDBACKS = '/v1/feedbacks';
export const API_APP_PASSWORD = '/validate';
export const API_RANKING = '/v1/ranking/rooms';
export const API_PUBLIC_RANKING = '/v1/ranking/public/rooms';

export const GAME_EPISODE = 'GameApp-episode';
export const GAME_ELECTRON = 'GameApp-electron';
export const GAME_CLASSROOM = 'GameApp-classroom';
export const GAME_PREPARATION = 'GameApp-isPreparation';
export const SELECT_ALL_EPISODES = 'GameApp-all-episodes';
export const LOCAL_LANGUAGE = 'GameApp-local-language';
export const LOCAL_COUNTRY = 'GameApp-local-language';
export const TRANSLATION_MODE_KEY = 'TRANSLATION_MODE';
export const GAME_HOST = 'GameApp-host';
export const USER_TEAM = 'GameApp-user-team';

export const APP_ROUTES = {
  CLASSROOM: '/classroom',
  START: '/start',
  APP_VALIDATION: '/app-password',
  SIGNUP: '/signup',
  LOGOUT: '/logout',
  GAME_BOARD: '/gameboard',
  SELECT_GAME_MODE: '/select-mode',
  SELECT_TEAM_MODE: '/select-team-mode',
  CREATE_TEAM: '/create-team',
  JOIN_TEAM: '/join-team',
  LOBBY: '/lobby',
  CONGRATULATIONS: '/congratulations',
  FEEDBACK: '/rating-comment',
  LEADER_BOARD: '/leaderboard',
  END: '/end'
}
