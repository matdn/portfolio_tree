import { NavigateFunction } from "react-router-dom";

export class EndExperienceCommand {

    public static Execute(navigateFunction: NavigateFunction) {

        console.log('game finish !!!!');
        navigateFunction('/congratulations')
    }

}