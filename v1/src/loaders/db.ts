import mongoose from "mongoose";

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Connected to database");
})

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shipment-management-test", {
            authSource: "admin",
        });
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
}

const connectDBTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shipment-management-test");
        // await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb://localhost:27017/shipment-management-test", {
        //     authSource: "admin",
        // });
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
}

const connect = process.env.NODE_ENV === "production" ? connectDB : connectDBTest;

export default connect;