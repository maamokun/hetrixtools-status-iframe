import { QuickDB, MemoryDriver } from "quick.db";
import { config } from "dotenv";
config();

const memoryDriver = new MemoryDriver();
const db = new QuickDB({ driver: memoryDriver });

export async function ForceUpdateData() {
    const key = process.env.HETRIX_KEY;

    const options = {
        headers: {
          'Authorization': `Bearer ${key}`
        }
    }

    console.log("Force Resyncing HetrixTools data...");
    try {
        const response = await fetch(`https://api.hetrixtools.com/v3/uptime-monitors?uptime_status=down`, options);
        if(response.status !== 200) {
            console.error("Failed to fetch HetrixTools data: ", response);
            return;
        }
        const data = await response.json();
        if (data) {
            const TotalMonitors = data.meta.total;
            const DownMonitors = data.meta.total_filtered;
            console.log("TotalMonitors: ", TotalMonitors);
            console.log("DownMonitors: ", DownMonitors);
            db.set("TotalMonitors", TotalMonitors);
            db.set("DownMonitors", DownMonitors);
        }
    } catch (error) {
        console.error("Failed to fetch HetrixTools data: ", error);
    }
}


export function runClient() {
    const key = process.env.HETRIX_KEY;
    const interval = process.env.UPDATE_INTERVAL || 3600000;

    console.log(`Starting HetrixTools client with key: ${key} and interval: ${interval}ms`);

    const options = {
        headers: {
          'Authorization': `Bearer ${key}`
        }
    }

    setInterval(async () => {
        console.log("Resyncing HetrixTools data...");
        try {
            const response = await fetch(`https://api.hetrixtools.com/v3/uptime-monitors?uptime_status=down`, options);
            if(response.status !== 200) {
                console.error("Failed to fetch HetrixTools data: ", response);
                return;
            }
            const data = await response.json();
            if (data) {
                const TotalMonitors = data.meta.total;
                const DownMonitors = data.meta.total_filtered;
                console.log("TotalMonitors: ", TotalMonitors);
                console.log("DownMonitors: ", DownMonitors);
                db.set("TotalMonitors", TotalMonitors);
                db.set("DownMonitors", DownMonitors);
            }
        } catch (error) {
            console.error("Failed to fetch HetrixTools data: ", error);
        }
    }, interval);
}

export async function getData() {
    const json = {
        TotalMonitors: await db.get("TotalMonitors"),
        DownMonitors: await db.get("DownMonitors")
    }
    return json;
}

export async function RemoveOnline() {
    const NewCount = await db.get("DownMonitors") + 1;
    db.set("DownMonitors", NewCount);
    console.log("Increased DownMonitors by 1");
}

export async function AddOnline() {
    const NewCount = await db.get("DownMonitors") - 1;
    db.set("DownMonitors", NewCount);
    console.log("Decreased DownMonitors by 1");
}