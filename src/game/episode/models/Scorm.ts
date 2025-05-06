export type CompletionStatus = 'passed' | 'completed' | 'failed' | 'incomplete' | 'browsed' | 'not attempted' | 'unknown';

interface ScoreObject {
  value: number;
  min: number;
  max: number;
  status: CompletionStatus;
}

interface RatingAndComment {
  rating: number;
  comment: string;
}

export class ScormData {
  learnerName: string;
  learnerId: string;
  completionStatus: CompletionStatus;
  suspendData: object
  scormVersion: '1.2' | '2004'
}

export class Scorm extends ScormData {
  getSuspendData: () => Promise<unknown>;
  setSuspendData: (key: string, value: any) => Promise<unknown>;
  clearSuspendData: () => Promise<unknown>;
  setStatus: (status: CompletionStatus) => Promise<void>;
  setScore: (scoreObject: ScoreObject) => Promise<unknown[]>;
  set: (key: string, value: any, deferSaveCall: boolean) => Promise<unknown>;
  get: (key: string) => any;
  complete: () => void;
  closeScormAPIConnection: () => void;
  quitScorm: () => void;
  setRatingAndComment: (payload: RatingAndComment) => Promise<unknown>;
}
