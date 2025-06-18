/**
 * Reverse geocode coordinates to get physical address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Promise resolving to address string or null if not found
 */
export async function getAddressFromCoords(lat: number, lng: number): Promise<string | null> {
  try {
    // First try browser's built-in geocoding (more accurate but requires user permission)
    if ("geolocation" in navigator) {
      const browserGeocode = await browserGeocoding(lat, lng);
      if (browserGeocode) return browserGeocode;
    }

    // Fallback to Nominatim API
    return await nominatimGeocoding(lat, lng);
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Browser's built-in geocoding (more accurate)
// Currently not supported in browsers, so always return null
async function browserGeocoding(lat: number, lng: number): Promise<string | null> {
  return null;
}

// OpenStreetMap Nominatim API (no API key needed)
async function nominatimGeocoding(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );

    if (!response.ok) throw new Error("Geocoding failed");

    const data = await response.json();

    if (data.error) {
      console.error("Geocoding error:", data.error);
      return null;
    }

    const address = data.address;
    if (!address) return null;

    // Construct readable address from available components
    const addressParts = [
      address.road,
      address.neighbourhood,
      address.suburb,
      address.city,
      address.town,
      address.village,
      address.county,
      address.state,
      address.postcode,
      address.country,
    ].filter(Boolean);

    return addressParts.join(", ");
  } catch (error) {
    console.error("Nominatim geocoding error:", error);
    return null;
  }
}
