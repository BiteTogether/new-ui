import axios from "axios";
const KEY = process.env.EXPO_PUBLIC_VIETMAP_API_KEY;
// Vietmap autocomplete API
export const searchNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  text: string,
) => {
  const API_KEY = KEY;
  const focus = `${latitude},${longitude}`;
  const display_type = 2;
  const circle_radius = 10;
  const url = `https://maps.vietmap.vn/api/autocomplete/v4?text=${encodeURIComponent(text)}&apikey=${API_KEY}&focus=${encodeURIComponent(focus)}&display_type=${display_type}&circle_radius=${circle_radius}`;
  try {
    const res = await axios.get(url);
    return res;
  } catch (err) {
    console.error("Error fetching places:", err);
  }
};

export const searchRestaurant = async (text: string) => {
  const API_KEY = KEY;
  const display_type = 2;
  const url = `https://maps.vietmap.vn/api/autocomplete/v4?text=${encodeURIComponent(text)}&apikey=${API_KEY}&display_type=${display_type}`;
  try {
    const res = await axios.get(url);
    return res;
  } catch (err) {
    console.error("Error fetching places:", err);
  }
};

export const getRestaurantDetails = async (refId: string) => {
  const API_KEY = KEY;
  const url = `https://maps.vietmap.vn/api/place/v4?apikey=${API_KEY}&refid=${refId}`;
  try {
    const res = await axios.get(url);
    return res;
  } catch (err) {
    console.error("Error fetching place details:", err);
  }
};
