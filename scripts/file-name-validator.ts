import fs from 'fs';
import path from 'path';

const getFilesRecursively = (
  directoryPath: string,
  filesNames: string[]
): string[] => {
  const filesInDirectory = fs.readdirSync(directoryPath);
  for (const file of filesInDirectory) {
    const absolute = path.join(directoryPath, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute, filesNames);
    } else {
      filesNames.push(absolute);
    }
  }

  return filesNames;
};

const validateFileNames = () => {
  const filesNames: string[] = [];
  const fileNames = getFilesRecursively('./src', filesNames);
  const regex = /^[a-zA-Z0-9_\-.\/]*$/;
  if (!fileNames?.length) {
    return;
  }

  fileNames.forEach(fileName => {
    if (!regex.test(fileName)) {
      console.log(fileName);
      throw new Error(`Invalid file name: ${fileName}`);
    }
  });
};

validateFileNames();
