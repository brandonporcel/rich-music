"use client";
import { useState } from "react";
import Link from "next/link";
import css from "./form.module.css";

export default function Form() {
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
  const [newVinyl, setNewVinyl] = useState(initialVinyl);
  const [pass, setPass] = useState("");
  const faces: ("face1" | "face2" | "face3" | "face4" | "face5" | "face6")[] = [
    "face1",
    "face2",
    "face3",
    "face4",
    "face5",
    "face6",
  ];

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
    setIsSubmitting(true);
    await createVinyl(data);
    setIsSubmitting(false);
    setNewVinyl(initialVinyl);
    setPass("");
    setErrors({});
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

  const createVinyl = async (data: any) => {
    try {
      await fetch("/api/vinyls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(error);
    }
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
      <div className={css.faces}>
        {faces.map((face, index) => (
          <input
            key={index}
            className={css.small}
            type="text"
            placeholder={`face ${index + 1}`}
            name={face}
            onChange={handleChange}
            value={newVinyl[face]}
          />
        ))}
      </div>
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
