import axios from 'axios';
import Fuse from 'fuse.js';
import dotenv from 'dotenv';
import { readFile } from '../utils/fileUtils.js';
import { generateAIContent } from '../services/aiService.js';
import { filterHospitalsBySpecialization } from '../services/hospitalService.js';

dotenv.config();

export const findNearestHospitalsAndFilter = async (req, res) => {
  const { pickupLatitudes, pickupLongitudes, radius = 1500, userInput } = req.body;

  if (!pickupLatitudes || !pickupLongitudes) {
    return res.status(400).json({ success: false, message: 'Latitude and Longitude are required.' });
  }

  if (!userInput) {
    return res.status(400).json({ message: 'Input is required' });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pickupLatitudes},${pickupLongitudes}&radius=${radius}&type=hospital&key=${apiKey}`;

    const response = await axios.get(url);
    if (!response.data || !response.data.results) {
      return res.status(404).json({ success: false, message: 'No hospitals found in the specified radius.' });
    }

    const hospitals = response.data.results.map((hospital) => ({
      name: hospital.name,
      address: hospital.vicinity,
      rating: hospital.rating || 'No rating available',
      userRatingsTotal: hospital.user_ratings_total || 0,
      location: hospital.geometry.location,
      openNow: hospital.opening_hours?.open_now || false,
    }));

    const promptData = await readFile('./public/data/promptForAi.txt');
    const basePrompt = `${promptData.trim()} ${userInput}`;

    const aiResponse = await generateAIContent(basePrompt);

    const filteredHospitals = await filterHospitalsBySpecialization(aiResponse);

    const mergedHospitals = hospitals.filter((hospital) => {
      // Set up Fuse.js for fuzzy matching
      const options = {
        includeScore: true,
        threshold: 0.3, // Set a threshold for fuzziness (0.0 to 1.0, lower means more strict)
        keys: ['name'], // We only want to match based on the 'name' field
      };
      
      const fuse = new Fuse(filteredHospitals, options);
      
      // Use Fuse.js to search for a match in filteredHospitals
      const result = fuse.search(hospital.name);
      
      // If a match is found within the threshold, we include the hospital
      return result.length > 0 && result[0].score <= 0.3; // Adjust the score threshold as needed
    });

    return res.status(200).json({
      success: true,
      hospitals: mergedHospitals,
      total: mergedHospitals.length,
      aiResponse,
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    return res.status(500).json({ success: false, message: 'Error processing request' });
  }
};
