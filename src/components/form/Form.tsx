"use client";
import { useState } from "react";
import Link from "next/link";
import css from "./form.module.css";
import { createVinyl } from "@/services/vinyls";

const initialVinyl = {
  name: "",
  thumbnail: "",
  face1: "",
  face2: "",
  face3: "",
  face4: "",
  face5: "",
  face6: "",
};

export default function Form() {
  const [newVinyl, setNewVinyl] = useState(initialVinyl);
  const [pass, setPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let errs = validate();
    if (Object.keys(errs).length || !pass) {
      return setErrors(errs);
    }
    const data = {
      pass,
      vinyl: newVinyl,
    };
    try {
      setIsSubmitting(true);
      await createVinyl(data);
      setErrors({});
      setNewVinyl(initialVinyl);
      setPass("");
    } catch (error) {
      alert("Hubo un error");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: any) => {
    setNewVinyl({ ...newVinyl, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors: any = {};

    if (!newVinyl.name || newVinyl.name.trim() === "") {
      errors.name = "name is required";
    }
    if (!newVinyl.thumbnail || newVinyl.thumbnail.trim() === "") {
      errors.thumbnail = "thumbnail is required";
    }

    return errors;
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
        value={newVinyl.name}
        autoFocus
        required
      />
      <input
        className={css.input}
        type="text"
        placeholder="thumbnail"
        name="thumbnail"
        onChange={handleChange}
        value={newVinyl.thumbnail}
        required
      />
      <textarea
        className={css.textarea}
        value={pass}
        onChange={({ target }) => setPass(target.value)}
        name="pass"
        placeholder="pass"
        required
      ></textarea>

      <button disabled={isSubmitting} className={css.button}>
        add
      </button>
    </form>
  );
}
