import { CommonAssetsManager } from '@cooker/common';
import { Core } from '../../Core';
import { AugmentedObject3D } from '../../_engine/threejs/views/components/AugmentedObject3D';
import { CoreInitCommand } from './initcommands/CoreInitCommand';
import InitCommandBase from './initcommands/bases/InitCommandBase';

export default class InitCommand {

  private static _InitCommandsList: Array<InitCommandBase> = [];

  private static _ThreeAssetsManager: any;

  private static _IsInitCore: boolean = false;
  // private static _IsInitI18n: boolean = false;


  public static async Execute(initCommands: Array<InitCommandBase>) {
    console.log('InitCommand');
    this._InitCommandsList = [];
    if (Core.UseThree) this._ThreeAssetsManager = (await import('@cooker/three')).ThreeAssetsManager;

    if (!this._IsInitCore) {
      this._IsInitCore = true;
      this._InitCommandsList.push(new CoreInitCommand());

      if (Core.UseThree) {
        AugmentedObject3D.Init();
        const threeModule = await import('../../_engine/threejs/commands/inits/initcommands/ThreeInitCommand');
        this._InitCommandsList.push(new threeModule.ThreeInitCommand());
      }
    }
    this._InitCommandsList = this._InitCommandsList.concat(initCommands);
    await this._LoadAssets();
    // if (!this._IsInitI18n) {
    //   this._IsInitI18n = true;
    //   await TextsProxy.Init();
    // }
    await this._InitProxies();
    await this._InitManagers();

    await Promise.all(this._InitCommandsList.map((command) => command.initAfterLoad()));
    await this._AddViews();
    await this._AddTheaters();

    // for (const theater of TheatersProxy.TheatersMap.values()) {
    //   const st = theater as SuperTheaterBase;
    //   st.testInitCommandsList(this._InitCommandsList);
    // }
  }

  //
  //_LoadCooker
  //
  private static async _LoadAssets(): Promise<void> {
    await this._InitCommon();
    if (Core.UseThree) await this._InitThree();
    await this._Load();
  }

  private static async _InitCommon(): Promise<void> {
    await Promise.all(this._InitCommandsList.map((command) => command.initCommon()));
    // for (let o of this._InitCommandsList) await o.initCommon();
  }

  private static async _InitThree(): Promise<void> {
    await Promise.all(this._InitCommandsList.map((command) => command.initThree()));
  }

  public static async _Load(): Promise<void> {
    await CommonAssetsManager.Load();
    if (Core.UseThree) await this._ThreeAssetsManager.Load();
  }

  //
  // Init Proxies
  //
  private static async _InitProxies(): Promise<void> {
    await Promise.all(
      this._InitCommandsList.map((command) => {
        return command.initProxies();
      }),
    );
    // for (let o of this._InitCommandsList) await o.initProxies();
  }

  //
  // Init managers
  //
  private static async _InitManagers(): Promise<void> {
    await Promise.all(this._InitCommandsList.map((command) => command.initManagers()));
    // for (let o of this._InitCommandsList) await o.initManagers();
  }

  //
  // AddViews
  //
  private static async _AddViews(): Promise<void> {
    await Promise.all(this._InitCommandsList.map((command) => command.addViews()));
    // for (let o of this._InitCommandsList) await o.addViews();
  }

  //
  // AdddTheaters
  //
  private static async _AddTheaters(): Promise<void> {
    await Promise.all(this._InitCommandsList.map((command) => command.addTheaters()));
    // for (let o of this._InitCommandsList) await o.addTheaters();
  }

  //#region Getters
  public static get ThreeAssetsManager(): any { return this._ThreeAssetsManager; };
  //#endregion
}
