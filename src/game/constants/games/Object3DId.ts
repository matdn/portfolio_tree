import { AssetId } from "./AssetId";

export enum Object3DId {
    MAIN = AssetId.GLTF_MAIN + 'PORTFOLIO',
    PROJECTS = AssetId.GLTF_MAIN + 'Projects',
    SCREENS = AssetId.GLTF_MAIN + 'Screens',
    CAMERAS_POS = AssetId.GLTF_MAIN + 'CameraPos',
    MOUNTAIN = AssetId.GLTF_MAIN + 'Landscape',
    SWEATER = AssetId.GLTF_MAIN + 'sweat',
    CINEMA = AssetId.GLTF_CINEMA + 'Cinema',
    CINEMA_WALL = AssetId.GLTF_CINEMA + 'Cinem',
    CINEMA_BOX = AssetId.GLTF_CINEMA + 'Box',
    CINEMA_BENCH = AssetId.GLTF_CINEMA + 'bench',
}