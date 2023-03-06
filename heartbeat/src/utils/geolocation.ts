export function getRandomLocationInRandomState(): {
  latitude: number;
  longitude: number;
} {
  // Define the latitude and longitude ranges for each state
  const stateRanges: {
    [key: string]: { latitude: [number, number]; longitude: [number, number] };
  } = {
    California: {
      latitude: [32.528832, 42.009518],
      longitude: [-124.409619, -114.131211],
    },
    NewYork: {
      latitude: [40.477399, 45.015861],
      longitude: [-79.762152, -71.777491],
    },
  };

  // Get an array of the state names
  const stateNames = Object.keys(stateRanges);
  const randomState = stateNames[Math.floor(Math.random() * stateNames.length)];
  const { latitude, longitude } = stateRanges[randomState];

  // Generate a random latitude and longitude within the state ranges
  const randomLatitude =
    Math.random() * (latitude[1] - latitude[0]) + latitude[0];
  const randomLongitude =
    Math.random() * (longitude[1] - longitude[0]) + longitude[0];

  return { latitude: randomLatitude, longitude: randomLongitude };
}

export function generateRandomKmPoint(): { km: number; point: number } {
  const km = Math.floor(Math.random() * 141) + 60;
  let point: number;
  if (km >= 60 && km < 80) {
    point = 1;
  } else if (km >= 80 && km < 100) {
    point = 2;
  } else {
    point = 5;
  }
  return { km, point };
}
