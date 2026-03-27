# LocalVibe

A hyperlocal event discovery platform where you can find exactly what's happening near you—from open mic nights to pop-up markets.

## Features
- **Location-Aware Mapping**: Automatically centers on your location and shows nearby events.
- **Geospatial Discovery (MongoDB 2dsphere)**: Filter upcoming events within a specific radius (e.g. 10km).
- **Address Autocomplete (OpenStreetMap Nominatim API)**: Search for event locations when creating an event—automatically converts street addresses into latitude and longitude coordinates.
- **Recommendation Engine**: Suggests events for you. If you RSVP to "Music" events frequently, the recommendation engine will suggest other upcoming Music events.
- **Featured Events**: Premium event organizers can feature their events, giving them a larger, distinct gold map pin.

## Tech Stack
- Frontend: React (Vite), React-Leaflet
- Backend: Node.js, Express.js
- Database: MongoDB
- Map APIs: OpenStreetMap (Tiles & Nominatim for geocoding)

## API Key Management & Best Practices

To fulfill the Map visualization requirements, this project uses **Leaflet.js** partnered with **OpenStreetMap (OSM)** for tile rendering and **Nominatim** for address autocomplete (geocoding). 

**The OpenStreetMap infrastructure is free and open-source, thereby requiring NO personal API Keys.**

*Why this is important for security:* If we used a paid service like Google Maps Platform or Mapbox, we would need to generate restricted API keys. In production, these keys should always be restricted via the provider's dashboard to only accept requests originating from allowed domains (e.g. `https://your-domain.com`). This prevents key theft where malicious actors could copy your API key from the frontend source code and use it on their own servers, racking up extreme billing charges.

Because we are using free, open-source mapping alternatives (Leaflet + OpenStreetMap), we do not need to implement these domain restrictions for this project.

## How to Run Locally

### Start Backend
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

*(To optionally seed the database with sample events, run `node seed/seedEvents.js` from the `backend` folder).*

### Start Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
