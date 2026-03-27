const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Event = require("../src/models/Event");
const User = require("../src/models/User");

const MONGO_URI = process.env.MONGO_URI;

const seedEvents = [
  // Hyderabad
  {
    title: "Hyderabad Food Festival",
    description: "Taste the best of Hyderabadi biryani, haleem, and street food from across the city.",
    category: "Food & Drink",
    startDate: new Date("2025-08-10T11:00:00"),
    endDate: new Date("2025-08-10T21:00:00"),
    location: { type: "Point", coordinates: [78.4867, 17.3850], address: "Necklace Road, Hyderabad", city: "Hyderabad", country: "IN" },
    price: 0, isFree: true, isFeatured: true,
  },
  {
    title: "Charminar Night Walk",
    description: "Guided heritage walk around Charminar and the old city bazaars at night.",
    category: "Community",
    startDate: new Date("2025-08-12T19:00:00"),
    endDate: new Date("2025-08-12T21:30:00"),
    location: { type: "Point", coordinates: [78.4747, 17.3616], address: "Charminar, Old City, Hyderabad", city: "Hyderabad", country: "IN" },
    price: 200, isFree: false,
  },
  {
    title: "Banjara Hills Art Exhibition",
    description: "Local artists showcasing paintings, sculptures and digital art.",
    category: "Arts",
    startDate: new Date("2025-08-14T10:00:00"),
    endDate: new Date("2025-08-14T18:00:00"),
    location: { type: "Point", coordinates: [78.4483, 17.4156], address: "Road No. 12, Banjara Hills, Hyderabad", city: "Hyderabad", country: "IN" },
    price: 0, isFree: true,
  },
  {
    title: "HITEC City Startup Meetup",
    description: "Network with founders, developers and investors in Hyderabad's tech hub.",
    category: "Community",
    startDate: new Date("2025-08-15T18:00:00"),
    endDate: new Date("2025-08-15T21:00:00"),
    location: { type: "Point", coordinates: [78.3814, 17.4435], address: "T-Hub, HITEC City, Hyderabad", city: "Hyderabad", country: "IN" },
    price: 0, isFree: true, isFeatured: true,
  },
  {
    title: "Hussain Sagar Yoga Morning",
    description: "Free sunrise yoga session at the iconic Hussain Sagar lake.",
    category: "Sports",
    startDate: new Date("2025-08-16T06:00:00"),
    endDate: new Date("2025-08-16T07:30:00"),
    location: { type: "Point", coordinates: [78.4744, 17.4239], address: "Hussain Sagar Lake, Hyderabad", city: "Hyderabad", country: "IN" },
    price: 0, isFree: true,
  },
  {
    title: "Jubilee Hills Live Music Night",
    description: "Local bands performing indie, fusion and Bollywood covers live.",
    category: "Music",
    startDate: new Date("2025-08-17T20:00:00"),
    endDate: new Date("2025-08-17T23:00:00"),
    location: { type: "Point", coordinates: [78.4081, 17.4317], address: "Jubilee Hills Check Post, Hyderabad", city: "Hyderabad", country: "IN" },
    price: 300, isFree: false,
  },
  {
    title: "Secunderabad Flea Market",
    description: "Weekend flea market with clothes, antiques, plants and homemade food stalls.",
    category: "Markets",
    startDate: new Date("2025-08-18T09:00:00"),
    endDate: new Date("2025-08-18T17:00:00"),
    location: { type: "Point", coordinates: [78.5011, 17.4399], address: "Paradise Circle, Secunderabad, Hyderabad", city: "Hyderabad", country: "IN" },
    price: 0, isFree: true,
  },

  // New York
  {
    title: "Brooklyn Flea Market",
    description: "Vintage clothing, antiques, food vendors and local artisans.",
    category: "Markets",
    startDate: new Date("2025-08-10T09:00:00"),
    endDate: new Date("2025-08-10T17:00:00"),
    location: { type: "Point", coordinates: [-73.9712, 40.7021], address: "Brooklyn Flea, Brooklyn", city: "New York", country: "US" },
    price: 0, isFree: true, isFeatured: true,
  },
  {
    title: "Jazz Night at Blue Note",
    description: "Live jazz performances by local and visiting artists.",
    category: "Music",
    startDate: new Date("2025-08-11T20:00:00"),
    endDate: new Date("2025-08-11T23:30:00"),
    location: { type: "Point", coordinates: [-74.0004, 40.7308], address: "131 W 3rd St, New York", city: "New York", country: "US" },
    price: 25, isFree: false,
  },

  // London
  {
    title: "Borough Market Food Festival",
    description: "The best of British and international street food.",
    category: "Food & Drink",
    startDate: new Date("2025-08-15T10:00:00"),
    endDate: new Date("2025-08-15T18:00:00"),
    location: { type: "Point", coordinates: [-0.0906, 51.5055], address: "Borough Market, London Bridge", city: "London", country: "UK" },
    price: 0, isFree: true, isFeatured: true,
  },

  // Mumbai
  {
    title: "Bandra Garage Sale",
    description: "Community garage sale — clothes, electronics, books at amazing prices.",
    category: "Markets",
    startDate: new Date("2025-08-18T10:00:00"),
    endDate: new Date("2025-08-18T16:00:00"),
    location: { type: "Point", coordinates: [72.8296, 19.0596], address: "Pali Hill, Bandra West, Mumbai", city: "Mumbai", country: "IN" },
    price: 0, isFree: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let organizer = await User.findOne({ email: "demo@localvibe.com" });
    if (!organizer) {
      organizer = await User.create({
        name: "LocalVibe Demo",
        email: "demo@localvibe.com",
        password: "localvibe123",
        role: "organizer",
      });
      console.log("✅ Demo organizer created");
    }

    await Event.deleteMany({});
    console.log("🗑️  Cleared existing events");

    const eventsWithOrganizer = seedEvents.map((e) => ({ ...e, organizer: organizer._id }));
    await Event.insertMany(eventsWithOrganizer);
    console.log(`✅ ${seedEvents.length} events seeded successfully!`);
    console.log("\n📋 Demo login: demo@localvibe.com / localvibe123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seed();