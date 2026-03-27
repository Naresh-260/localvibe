const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");
const { PORT } = require("./src/config/env.js");

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});