"use client";

import { useState, useEffect, useCallback } from "react";

type Favorites = {
  teams: number[];
  players: number[];
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>({ teams: [], players: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/favorites");
        const data: Favorites = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = useCallback(
    async (type: "team" | "player", id: number) => {
      const isCurrentlyFavorite = type === "team" ? favorites.teams.includes(id) : favorites.players.includes(id);

      const method = isCurrentlyFavorite ? "DELETE" : "POST";

      try {
        if (isCurrentlyFavorite) {
          setFavorites((prev) => ({ ...prev, [type === "team" ? "teams" : "players"]: prev[type === "team" ? "teams" : "players"].filter((favId) => favId !== id) }));
        } else {
          setFavorites((prev) => ({ ...prev, [type === "team" ? "teams" : "players"]: [...prev[type === "team" ? "teams" : "players"], id] }));
        }

        await fetch("/api/favorites", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, id }),
        });
      } catch (error) {
        console.error(`Failed to ${method} favorite`, error);
      }
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (type: "team" | "player", id: number) => {
      if (isLoading) return false;
      return type === "team" ? favorites.teams.includes(id) : favorites.players.includes(id);
    },
    [favorites, isLoading]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoadingFavorites: isLoading,
  };
}
