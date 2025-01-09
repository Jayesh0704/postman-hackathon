import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const findNearestHospitals = async (req, res) => {
  const { pickupLatitudes, pickupLongitudes, radius = 1500 } = req.query;

  if (!pickupLatitudes || !pickupLongitudes) {
    return res.status(400).json({ success: false, message: 'Latitude and Longitude are required.' });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pickupLatitudes},${pickupLongitudes}&radius=${radius}&type=hospital&key=${apiKey}`;

    const response = await axios.get(url);
    console.log(response.data);

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

    return res.status(200).json({
      success: true,
      hospitals,
      total: hospitals.length,
      nextPageToken: response.data.next_page_token || null,
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching nearest hospitals.' });
  }
};
