import fs from 'fs';
import path from 'path';

const episodesFileDir = 'public/jsons/data/';
const episodesFileName = 'episodes.json';
const outFile = 'public/jsons/data/episodes.be.json'

const readJsonFile = p => JSON.parse(fs.readFileSync(p, { encoding: 'utf8' }));
const writeJsonFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', { encoding: 'utf8' })

const episodes = readJsonFile(path.join(episodesFileDir, episodesFileName));

function deleteKeyIfValueNotExist(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
}

function mapSceneElements(sceneElements) {
  const elementsObject = {};

  sceneElements.forEach(sceneElement => {
    elementsObject[sceneElement.name] = deleteKeyIfValueNotExist({
      score: sceneElement.score,
      allowCustomScore: sceneElement.allowCustomScore
    })
  });

  return elementsObject;
}

function mapScenes(scenes) {
  const scenesObject = {};
  scenes.forEach(scene => {
    scenesObject[scene.name] = {
      elements: mapSceneElements(scene.elements)
    }
  });

  return scenesObject;
}

function mapEpisodes(episodes) {
  const convertedEpisodes = {}

  try {
    episodes.forEach(episode => {
      convertedEpisodes[episode.name] = deleteKeyIfValueNotExist({
        status: episode.status,
        startDate: episode.startDate,
        endDate: episode.endDate,
        thumbnailUrl: episode.thumbnailUrl,
        maxScore: episode.maxScore,
        roomCreationBonusPoints: episode.roomCreationBonusPoints,
        customData: episode.customData ? JSON.stringify(episode.customData) : undefined,
        scenes: mapScenes(episode.scenes),
      })
    })
  } catch (e) {
    console.log(e);
  }

  return convertedEpisodes;
}

function main() {
  const res = mapEpisodes(episodes)
  console.log(JSON.stringify(res, null, 2))
  writeJsonFile(outFile, res)
}

main()
