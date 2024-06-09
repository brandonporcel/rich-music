import { Vinyl } from "@/utils/Definitions";

export const getVinyls = async (): Promise<Vinyl[]> => {
  try {
    const res = await fetch("/api/vinyls");
    const data = await res.json();

    return parseVinyls(data);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const parseVinyls = (data: any[]) => {
  return data.map(parseVinyl);
};

export const parseVinyl = (item: any): Vinyl => {
  return {
    id: item._id,
    name: item.name,
    thumbnail: item.thumbnail,
    artist: item.artist ?? "",
  };
};
