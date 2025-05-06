import i18n from 'i18next';
import { toast } from 'react-toastify';
import {
  GAME_CLASSROOM,
  GAME_ELECTRON,
  GAME_EPISODE,
  GAME_PREPARATION,
  SELECT_ALL_EPISODES,
} from '../constants/common.constant.tsx';
import { isScorm } from './scorm.helper.ts';

export function randomString() {
  return (Math.random() + 1).toString(36).substring(2);
}

export function nthNumber(value: number) {
  return (value > 0 ? value : 'N/A') + (value > 0
    ? ['th', 'st', 'nd', 'rd'][(value > 3 && value < 21) || value % 10 > 3 ? 0 : value % 10]
    : '');
}

export function getAppUrl(url: string) {
  const hostUrl = `${window.location.protocol}//${window.location.host}`;
  if (!isScorm()) {
    return `${hostUrl}/${url}`;
  }

  const scormUrl = window.location.href.split('/index.html');
  if (!scormUrl.length) {
    return `${hostUrl}/${url}`;
  }

  return scormUrl[0] + url;
}

export function getAssetUrl(assetUrl: string) {
  if (!isScorm()) {
    return assetUrl;
  }

  const scormUrl = window.location.href.split('/index.html');
  if (!scormUrl.length) {
    return assetUrl;
  }

  return scormUrl[0] + assetUrl;
}

export const setAuthenticated = (isAuthenticated: boolean) => {
  sessionStorage.setItem('GameApp-isAuthenticated', String(isAuthenticated));
};

export const normalizeUsername = (username: string): string => {
  return username?.replaceAll(' ', '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replaceAll('đ', 'd')
    .replaceAll('ư', 'u')
    .replaceAll('ơ', 'o');
};

export function getCurrentLanguage() {
  return localStorage.getItem('i18nextLng');
}


export function openExternalLink(url: string) {
  if (!url.startsWith('http')) {
    url = '//' + url;
  }

  window.open(url, '_blank');
}

export function convertMilliseconds(milliseconds: number): { hours: number, minutes: string, seconds: string; } {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  return {
    hours,
    minutes: `${minutes < 10 ? '0' : ''}${minutes}`,
    seconds: `${+seconds < 10 ? '0' : ''}${seconds}`,
  };
}

export function getRemoteAssetsUrl(path: string, scormPath: string | null = null) {
  const remoteUrl = import.meta.env.VITE_REMOTE_ASSETS_URL;

  if (!remoteUrl?.length) {
    return (isScorm() && scormPath) ? scormPath : path;
  }

  return remoteUrl + path;
}

export function isStaging() {
  return import.meta.env.VITE_API_URL.includes('staging');
}

export const handleSignupError = (error: any) => {
  const { status, message } = error;
  if (status === 400) {
    if (message === 'Code exceed max usage') {
      toast.error(i18n.t('Signup.Error.CodeExceedsMaxUsage'));
      return;
    }
    toast.error(message);
    return;
  }

  toast.error(i18n.t('Global.Error.Wrong'));
};

export function getEpisode() {
  return sessionStorage.getItem(GAME_EPISODE) || import.meta.env.VITE_EPISODE;
}

export function isElectron() {
  return (sessionStorage.getItem(GAME_ELECTRON) ?? import.meta.env.VITE_IS_ELECTRON) === 'true';
}

export function isClassroom() {
  return (sessionStorage.getItem(GAME_CLASSROOM) ?? import.meta.env.VITE_IS_CLASSROOM) === 'true';
}

export function isPreparation() {
  return sessionStorage.getItem(GAME_PREPARATION) === 'true';
}

export function setEpisode(episode: string) {
  sessionStorage.setItem(GAME_EPISODE, episode);
}

export function selectAllChapters(value: boolean) {
  sessionStorage.setItem(SELECT_ALL_EPISODES, `${value}`);
}

export function areAllChaptersSelected() {
  return sessionStorage.getItem(SELECT_ALL_EPISODES) === 'true';
}

export function replaceUrl(from: string, to: string) {
  window.location.href = window.location.href.replace(from, to);
}

