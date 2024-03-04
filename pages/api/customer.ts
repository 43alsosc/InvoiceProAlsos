import { query } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const results = await query("SELECT * FROM customers");
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}
