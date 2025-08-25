import { Vinyl } from "@/utils/Definitions";
export const BASE_URL = process.env.NEXT_PUBLIC_URL;

export const getVinyls = async (): Promise<Vinyl[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/vinyls`);
    const data = await res.json();

    return parseVinyls(data);
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const getRandomVinyls = async (itemsQuantity = 1): Promise<Vinyl[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/randomLimit/${itemsQuantity}`);
    const data = await res.json();
    return parseVinyls(data);
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const createVinyl = async (data: any): Promise<Vinyl> => {
  try {
    const res = await fetch(`${BASE_URL}/api/vinyls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return parseVinyl(await res.json());
  } catch (error: any) {
    console.error(error.message);
    throw Error(error.message);
  }
};

export const updateVinyl = async (data: any): Promise<Vinyl> => {
  try {
    const res = await fetch(`${BASE_URL}/api/vinyls/${data.vinyl.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return parseVinyl(await res.json());
  } catch (error: any) {
    console.error(error.message);
    throw Error(error.message);
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
3;
