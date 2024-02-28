import express from "express";
import {
	getData,
	RemoveOnline,
	AddOnline,
	ForceUpdateData,
} from "./HetrixClient";
import { config } from "dotenv";
import path from "path";
config();

const key = process.env.HETRIX_AUTH;
const expectedAuth = `Bearer ${key}`;

export function runServer() {
	const app = express();
	app.use(express.json());
	app.set("view engine", "ejs");
	app.set("views", path.join(__dirname, "views"));

	const port = process.env.PORT || 3000;
	const key = process.env.ADMIN_KEY;
	const border = process.env.BORDER_COLOR || "#fff";
	const bgColor = process.env.BACKGROUND_COLOR || "#000";
	const textColor = process.env.TEXT_COLOR || "#fff";

	app.get("/", async (req, res) => {
		const json = await getData();
		const total = json.TotalMonitors;
		const down_monit = json.DownMonitors;

		if (down_monit > 0) {
			res.render("iframe", {
				dotColor: "#ffff00",
				customText: "Partial outage",
				borderColor: border,
				bgColor: bgColor,
				textColor: textColor,
			});
		}
		if (down_monit == 0) {
			res.render("iframe", {
				dotColor: "#00ff00",
				customText: "All systems online",
				borderColor: border,
				bgColor: bgColor,
				textColor: textColor,
			});
		}
		if (down_monit == total) {
			res.render("iframe", {
				dotColor: "#ff0000",
				customText: "Major outage",
				borderColor: border,
				bgColor: bgColor,
				textColor: textColor,
			});
		}
	});

	app.get("/raw", async (req, res) => {
		const json = await getData();
		res.json(json);
	});

	app.get("/update", async (req, res) => {
		const keyEntry = req.query.key;
		if (keyEntry !== key) {
			res.status(401).send("Unauthorized");
			return;
		}
		console.log("Remote update request received!");
		ForceUpdateData();
		res.send("Data Resynced!");
	});

	app.post("/ingest", (req, res) => {
		const json = req.body;
		const auth = req.headers.authorization;
		console.log("Data received!");
		if (auth !== expectedAuth) {
			console.error("Unauthorized request");
			res.status(401).send("Unauthorized");
			return;
		}
		if (json.monitor_status === "offline") {
			RemoveOnline();
		}
		if (json.monitor_status === "online") {
			AddOnline();
		}
	});

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
}
