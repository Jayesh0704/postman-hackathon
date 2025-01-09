import fs from 'fs';
import csv from 'csv-parser';

export const filterHospitalsBySpecialization = (apiResponse) => {
  const matchingHospitals = [];
  const searchSpecialties = apiResponse.toLowerCase().split(/[,\s]+/).filter((s) => s);

  return new Promise((resolve, reject) => {
    fs.createReadStream('./public/data/Hospital.csv')
      .pipe(csv())
      .on('data', (row) => {
        const hospitalSpecialties = row['Specializations']
          ?.toLowerCase()
          .split(/[,\s]+/)
          .filter((s) => s) || [];

        if (
          searchSpecialties.some((specialty) =>
            hospitalSpecialties.some(
              (hospSpecialty) =>
                hospSpecialty.includes(specialty) || specialty.includes(hospSpecialty)
            )
          )
        ) {
          matchingHospitals.push({
            name: row['Hospital / Private'],
            state: row['State'],
            city: row['City'],
            specializations: row['Specializations'],
            category: row['Category'],
          });
        }
      })
      .on('end', () => resolve(matchingHospitals))
      .on('error', (error) => reject(error));
  });
};
