import express from "express"
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ─── Website Endpoints ────────────────────────────────────────────────────────

app.post("/api/v1/website", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId!;
        const { url } = req.body;

        if (!url || typeof url !== "string") {
            res.status(400).json({ error: "A valid URL is required" });
            return;
        }

        const data = await prismaClient.website.create({
            data: { userId, url },
        });

        res.status(201).json({ id: data.id });
    } catch (err) {
        console.error("[POST /api/v1/website]", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
    try {
        const websiteId = req.query.websiteId as string;
        const userId = req.userId;

        if (!websiteId) {
            res.status(400).json({ error: "websiteId query param is required" });
            return;
        }

        const data = await prismaClient.website.findFirst({
            where: { id: websiteId, userId, disabled: false },
            include: { ticks: true },
        });

        if (!data) {
            res.status(404).json({ error: "Website not found" });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error("[GET /api/v1/website/status]", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId!;

        const websites = await prismaClient.website.findMany({
            where: { userId, disabled: false },
            include: { ticks: true },
        });

        res.json({ websites });
    } catch (err) {
        console.error("[GET /api/v1/websites]", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/api/v1/website", authMiddleware, async (req, res) => {
    try {
        const { websiteId } = req.body;
        const userId = req.userId!;

        if (!websiteId) {
            res.status(400).json({ error: "websiteId is required" });
            return;
        }

        await prismaClient.website.update({
            where: { id: websiteId, userId },
            data: { disabled: true },
        });

        res.json({ message: "Website deleted successfully" });
    } catch (err) {
        console.error("[DELETE /api/v1/website]", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ─── Payout Endpoint ─────────────────────────────────────────────────────────

app.post("/api/v1/payout/:validatorId", async (req, res) => {
    try {
        const { validatorId } = req.params;

        const validator = await prismaClient.validator.findFirst({
            where: { id: validatorId },
        });

        if (!validator) {
            res.status(404).json({ error: "Validator not found" });
            return;
        }

        if (validator.pendingPayouts === 0) {
            res.status(400).json({ error: "No pending payouts" });
            return;
        }

        // Reset pending payouts (actual Solana transfer to be implemented separately)
        await prismaClient.validator.update({
            where: { id: validatorId },
            data: { pendingPayouts: 0 },
        });

        res.json({
            message: "Payout processed",
            validatorId,
            amount: validator.pendingPayouts,
        });
    } catch (err) {
        console.error("[POST /api/v1/payout]", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[Unhandled Error]", err);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
});
