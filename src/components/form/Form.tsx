"use client";
import Link from "next/link";
import css from "./form.module.css";
import useVinylForm from "@/hooks/useVinylForm";
import { Vinyl } from "@/utils/Definitions";
import CountryInput from "./CountryInput";

export default function Form({
  initialData,
  onSuccess,
}: {
  initialData?: Vinyl;
  onSuccess?: (saved: Vinyl) => void;
}) {
  const { vinyl, pass, setPass, isSubmitting, handleChange, cancelEdit, save } =
    useVinylForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await save();
    if (saved && onSuccess) onSuccess(saved);
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.link}>
        <Link href="/">home</Link>
      </div>
      <input
        className={css.input}
        type="text"
        placeholder="name"
        name="name"
        onChange={handleChange}
        value={vinyl.name}
        required
      />
      <input
        className={css.input}
        type="text"
        placeholder="artist"
        name="artist"
        onChange={handleChange}
        value={vinyl.artist}
      />
      <input
        className={css.input}
        type="text"
        placeholder="thumbnail"
        name="thumbnail"
        onChange={handleChange}
        value={vinyl.thumbnail}
        required
      />
      <input
        className={css.input}
        type="text"
        placeholder="spotifyId"
        name="spotifyId"
        onChange={handleChange}
        value={vinyl.spotifyId || ""}
      />
      <textarea
        className={css.textarea}
        value={pass}
        onChange={({ target }) => setPass(target.value)}
        name="pass"
        placeholder="pass"
        required
      ></textarea>

      <CountryInput
        value={vinyl.country || ""}
        onChange={(code) =>
          handleChange({ target: { name: "country", value: code } } as any)
        }
      />

      <button disabled={isSubmitting} className={css.button}>
        {vinyl.id ? "update" : "add"}
      </button>

      {vinyl.id && (
        <button
          type="button"
          onClick={() => cancelEdit()}
          className={css.button + " " + css.cancel}
        >
          cancel
        </button>
      )}
    </form>
  );
}
