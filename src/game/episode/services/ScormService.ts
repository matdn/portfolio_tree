import { isScorm } from '../../../helpers/scorm.helper.ts';
import { CompletionStatus, Scorm } from '../models/Scorm.ts';

export class ScormService {
  public static async SetScormStatus(status: CompletionStatus) {
    if (!isScorm()) {
      return;
    }

    return this.Scorm.setStatus(status);
  }

  /**
   * Close scorm app
   */
  public static CloseScorm() {
    if (!isScorm()) {
      return;
    }

    window.close()
  }

  public static get Scorm(): Scorm {
    return globalThis.app.scorm;
  }
}
