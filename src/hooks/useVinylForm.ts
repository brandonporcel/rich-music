import { useState, useEffect } from "react";
import { BASE_URL, createVinyl, updateVinyl } from "@/services/vinyls";
import { mutate } from "swr";
import { Vinyl } from "@/utils/Definitions";

const emptyVinyl = {
  id: "",
  name: "",
  artist: "",
  spotifyId: "",
  thumbnail: "",
  face1: "",
  face2: "",
  face3: "",
  face4: "",
  face5: "",
  face6: "",
  country: "",
};

function useVinylForm(initialData: Vinyl = emptyVinyl) {
  const [vinyl, setVinyl] = useState<Vinyl>(initialData);
  const [pass, setPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 👇 sincronizar cuando cambie initialData
  useEffect(() => {
    setVinyl(initialData || emptyVinyl);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setVinyl({ ...vinyl, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!vinyl.name?.trim()) errs.name = "name is required";
    if (!vinyl.thumbnail?.trim()) errs.thumbnail = "thumbnail is required";
    return errs;
  };

  const save = async () => {
    const errs = validate();
    if (Object.keys(errs).length || !pass) {
      setErrors(errs);
      return;
    }
    try {
      setIsSubmitting(true);
      let saved: Vinyl | null = null;

      if (vinyl.id) {
        saved = await updateVinyl({ pass, vinyl });
        mutate(`${BASE_URL}/api/vinyls`);
      } else {
        saved = await createVinyl({ pass, vinyl });
        mutate(
          `${BASE_URL}/api/vinyls`,
          (curr: any) => (curr ? [...curr, saved] : [saved]),
          false,
        );
      }

      setErrors({});
      return saved;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setVinyl(emptyVinyl);
  };

  return {
    vinyl,
    setVinyl,
    pass,
    setPass,
    isSubmitting,
    errors,
    handleChange,
    save,
    cancelEdit,
  };
}
export default useVinylForm;
