const { exec } = require("child_process");

console.log("🚀 Starting Kanban Portfolio App...");

// Run migrations
exec(
  "npx knex --knexfile ./server/knexfile.js migrate:latest",
  (error, stdout, stderr) => {
    if (error) {
      console.log("Migration error:", error);
    } else {
      console.log("✅ Migrations complete");

      // Run seeds
      exec(
        "npx knex --knexfile ./server/knexfile.js seed:run",
        (error, stdout, stderr) => {
          if (error) {
            console.log("Seed error:", error);
          } else {
            console.log("✅ Seeds complete");
          }

          // Start server
          require("./server/server.js");
        }
      );
    }
  }
);
