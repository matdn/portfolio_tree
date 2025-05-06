/**
 * TheaterId must match with episode configuration in backend.
 * An episode is saved to user profile then a room is created when a theater is opened
 */

export enum TheaterId {
    NONE = 'NONE',

    MAIN = 'MAIN',
    LOBBY = 'LOBBY',
    MUSEUM = 'MUSEUM',
    GALLERIE = 'GALLERIE',
    PARK = 'PARK',
    GALERY = 'GALERY',
    PROJECT = 'PROJECT',
}
