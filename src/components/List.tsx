"use client";
import React, { useEffect, useState } from "react";
import { Vinyl } from "@/utils/Definitions";
import { getVinyls } from "@/services/vinyls";

export default function List() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const items = await getVinyls();
        setVinyls(items);
      } catch (error) {
        console.error("Error fetching vinyls:", error);
      }
    };
    getItems();
  }, []);

  return (
    <ol style={{ paddingLeft: "50px" }}>
      {vinyls.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ol>
  );
}
