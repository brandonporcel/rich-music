"use client";
import { useState, useRef } from "react";
import { COUNTRIES } from "@/utils/countries";
import css from "./form.module.css";

export default function CountryInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [query, setQuery] = useState(
    value ? `${COUNTRIES[value]?.flag} ${COUNTRIES[value]?.name}` : "",
  );
  const [open, setOpen] = useState(false);
  const skipBlur = useRef(false);

  const filtered =
    query.length < 1
      ? []
      : Object.entries(COUNTRIES).filter(
          ([code, { name }]) =>
            name.toLowerCase().includes(query.toLowerCase()) ||
            code.toLowerCase().includes(query.toLowerCase()),
        );

  const select = (code: string) => {
    onChange(code);
    setQuery(`${COUNTRIES[code].flag} ${COUNTRIES[code].name}`);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        className={css.input}
        type="text"
        placeholder="country"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          if (!skipBlur.current) setOpen(false);
        }}
      />
      {open && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            background: "#222",
            listStyle: "none",
            margin: 0,
            padding: "4px 0",
            width: "100%",
            zIndex: 10,
            border: "1px solid #444",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {filtered.map(([code, { name, flag }]) => (
            <li
              key={code}
              onMouseDown={() => {
                skipBlur.current = true;
              }}
              onMouseUp={() => {
                skipBlur.current = false;
                select(code);
              }}
              style={{ padding: "6px 12px", cursor: "pointer" }}
            >
              {flag} {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
