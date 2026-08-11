// Entry point: create HTTP server from app, attach Socket.IO (src/socket), listen on PORT.
import app from "./app.js";
import Sequelize from "./config/db.js";

const PORT = process.env.PORT || 3000;

const Start = async () =>{

    try {

        await Sequelize.authenticate();
        console.log("✅ DB connectée")

        await Sequelize.sync();
        console.log("✅ Tables synchronisées");

        app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
    } catch (error) {
        console.error("❌ Impossible de démarrer :", error);
        process.exit(1);
    }
};

Start();
