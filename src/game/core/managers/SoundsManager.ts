import { TheatersManager, TheatersProxy } from "pancake";
import { CommonAssetsManager, Sound, SpriteType } from "../../../../libs/cooker/common";
import { SuperTheaterBase } from "../theaters/SuperTheaterBase";

export class SoundsManager {

    public static FADE_LOOP_DURATION: number = 2500;



    public static Init() {
        TheatersManager.OnShowTheater.add(this._OnChangeTheater);
        TheatersManager.OnHideTheater.add(this._OnChangeTheater);
    }


    private static _OnChangeTheater = (): void => {
        this.RefreshTheatersSound();
    }

    public static RefreshTheatersSound(): void {
        const stopSounds = new Set<string>();
        const playSounds = new Set<string>();

        for (const [key, value] of TheatersProxy.TheatersMap) {
            if (value instanceof SuperTheaterBase) {
                for (const soundId of value.loopSoundsList) {
                    stopSounds.add(soundId);
                }
                for (const soundId of value.siblingSoundsList) {
                    stopSounds.add(soundId);
                }
            }
        }

        const theater = this.GetTopLoopSoundTheater();

        if (theater) {
            for (const soundId of theater.loopSoundsList) {
                stopSounds.delete(soundId);
                playSounds.add(soundId);
            }
            for (const soundId of theater.siblingSoundsList) {
                stopSounds.delete(soundId);
            }
        }


        for (const soundId of stopSounds) {
            SoundsManager.FadeOut(soundId);
        }

        for (const soundId of playSounds) {
            if (!SoundsManager.IsPlaying(soundId)) {
                SoundsManager.FadeIn(soundId, this.FADE_LOOP_DURATION, 'loop');
            }
        }

    }

    public static PlaySound(id: string, sprite?: SpriteType) {
        if (!CommonAssetsManager.HasAsset(id)) return;
        const sound = CommonAssetsManager.GetSound(id) as Sound;
        sound.play(sprite);
    }

    public static StopSound(id: string) {
        if (!CommonAssetsManager.HasAsset(id)) return;
        const sound = CommonAssetsManager.GetSound(id) as Sound;
        sound.stop();
    }

    public static IsPlaying(id: string): boolean {
        if (!CommonAssetsManager.HasAsset(id)) return false;
        const sound = CommonAssetsManager.GetSound(id) as Sound;
        return sound.isPlaying;
    }

    public static FadeIn(id: string, duration: number = this.FADE_LOOP_DURATION, sprite?: SpriteType) {
        if (!CommonAssetsManager.HasAsset(id)) return;
        const sound = CommonAssetsManager.GetSound(id) as Sound;
        sound.fadeIn(duration, sprite);
    }

    public static FadeOut(id: string, duration: number = this.FADE_LOOP_DURATION) {
        if (!CommonAssetsManager.HasAsset(id)) return;
        const sound = CommonAssetsManager.GetSound(id) as Sound;
        sound.fadeOut(duration);
    }

    public static GetTopLoopSoundTheater(): SuperTheaterBase | null {
        for (let i = TheatersManager.CurrentTheatersList.length - 1; i >= 0; i--) {
            const theater = TheatersManager.CurrentTheatersList[i];
            if (theater instanceof SuperTheaterBase) {
                if (theater.loopSoundsList.size > 0) {
                    return theater;
                }
                if (theater.siblingSoundsList.size > 0) {
                    return theater;
                }
            }
        }
        return null;
    }


}