import { QuickDB, MemoryDriver } from "quick.db";
import Express from "express";
import { config } from "dotenv";
import { runClient, ForceUpdateData } from "./HetrixClient";
import { runServer } from "./server";
config();

console.log("Validating .env file...");
console.log(
	"Tip: You can customize the iframe by setting the following environment variables: BORDER_COLOR, BACKGROUND_COLOR, TEXT_COLOR",
);

if (!process.env.HETRIX_KEY) {
	console.error("No HetrixTools API key found in .env file");
	process.exit(1);
}
if (!process.env.ADMIN_KEY) {
	console.error("No Administrator key found in .env file");
	process.exit(1);
}
if (!process.env.HETRIX_AUTH) {
	console.error("No Webhook Authentication Token found in .env file");
	process.exit(1);
}
if (!process.env.UPDATE_INTERVAL) {
	console.warn("No Update Interval specified, defaulting to 6 hours");
}
if (!process.env.PORT) {
	console.warn("No Port specified, defaulting to 3000");
}

ForceUpdateData();
runClient();
runServer();
