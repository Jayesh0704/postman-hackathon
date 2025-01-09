import fs from 'fs';

export const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('Error reading the file: ' + err.message);
      } else {
        resolve(data);
      }
    });
  });
};
