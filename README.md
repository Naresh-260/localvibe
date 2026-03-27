# LocalVibe

A hyperlocal event discovery platform where you can find exactly what's happening near you—from open mic nights to pop-up markets.

🌐 **Live App:** [https://localvibe-amber.vercel.app](https://localvibe-amber.vercel.app)  
⚙️ **Backend API:** [https://localvibe-backend-3cvj.onrender.com](https://localvibe-backend-3cvj.onrender.com)

> ⚠️ The backend is hosted on Render's free tier and may take ~30 seconds to wake up after inactivity.

---

## Features
- **Location-Aware Mapping**: Automatically centers on your location and shows nearby events.
- **Geospatial Discovery (MongoDB 2dsphere)**: Filter upcoming events within a specific radius (e.g. 10km).
- **Address Autocomplete (OpenStreetMap Nominatim API)**: Search for event locations when creating an event—automatically converts street addresses into latitude and longitude coordinates.
- **Recommendation Engine**: Suggests events for you. If you RSVP to "Music" events frequently, the recommendation engine will suggest other upcoming Music events.
- **Featured Events**: Premium event organizers can feature their events, giving them a larger, distinct gold map pin.

---

## Tech Stack
- Frontend: React (Vite), React-Leaflet
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Map APIs: OpenStreetMap (Tiles & Nominatim for geocoding)
- Deployment: Vercel (frontend) + Render (backend)

---

## API Key Management & Best Practices

To fulfill the Map visualization requirements, this project uses **Leaflet.js** partnered with **OpenStreetMap (OSM)** for tile rendering and **Nominatim** for address autocomplete (geocoding).

**The OpenStreetMap infrastructure is free and open-source, thereby requiring NO personal API Keys.**

*Why this is important for security:* If we used a paid service like Google Maps Platform or Mapbox, we would need to generate restricted API keys. In production, these keys should always be restricted via the provider's dashboard to only accept requests originating from allowed domains (e.g. `https://your-domain.com`). This prevents key theft where malicious actors could copy your API key from the frontend source code and use it on their own servers, racking up extreme billing charges.

Because we are using free, open-source mapping alternatives (Leaflet + OpenStreetMap), we do not need to implement these domain restrictions for this project.

---

## How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/Naresh260/localvibe.git
cd localvibe
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

*(To optionally seed the database with sample events, run `node seed/seedEvents.js` from the `backend` folder).*

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside `frontend/src/`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment

### Live URLs
| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://localvibe-amber.vercel.app |
| Backend | Render | https://localvibe-backend-3cvj.onrender.com |
| Database | MongoDB Atlas | Cluster0 |

### Environment Variables

**Backend (Render)**
| Variable | Value |
|---|---|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | your secret key |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://localvibe-amber.vercel.app` |

**Frontend (Vercel)**
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://localvibe-backend-3cvj.onrender.com/api` |
