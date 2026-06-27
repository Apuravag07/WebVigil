"use client";
import { API_BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface WebsiteTick {
    id: string;
    createdAt: string;
    status: string;
    latency: number;
}

interface Website {
    id: string;
    url: string;
    ticks: WebsiteTick[];
}

export function useWebsites() {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshWebsites = useCallback(async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
                headers: {
                    Authorization: token,
                },
            });

            setWebsites(response.data.websites ?? []);
            setError(null);
        } catch (err) {
            console.error("[useWebsites] Failed to fetch websites:", err);
            setError("Failed to load websites. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        refreshWebsites();

        // Poll every 60 seconds for fresh data
        const interval = setInterval(refreshWebsites, 60 * 1000);
        return () => clearInterval(interval);
    }, [refreshWebsites]);

    return { websites, refreshWebsites, isLoading, error };
}