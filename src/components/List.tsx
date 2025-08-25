"use client";
import useSWR from "swr";
import { Vinyl } from "@/utils/Definitions";
import { BASE_URL, getVinyls } from "@/services/vinyls";

export default function List({ onEdit }: { onEdit: (v: Vinyl) => void }) {
  const { data: vinyls, error } = useSWR<Vinyl[]>(
    `${BASE_URL}/api/vinyls`,
    getVinyls
  );

  if (error) {
    console.error(error);
    return (
      <p style={{ paddingLeft: "20px" }}>
        ❌ An error has occurred while loading vinyls.
      </p>
    );
  }
  if (!vinyls) return <p style={{ paddingLeft: "20px" }}>⏳ Loading...</p>;

  return (
    <ol style={{ paddingLeft: "50px", paddingBottom: "20px" }}>
      {vinyls.map((v) => (
        <li key={v.id}>
          {v.name}
          <button onClick={() => onEdit(v)} style={{ padding: 4 }}></button>
        </li>
      ))}
    </ol>
  );
}
