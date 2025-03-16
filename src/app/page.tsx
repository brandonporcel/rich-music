import ThreeScene from "@/components/ThreeScene";
import css from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/form" className={css.add}>
        add
      </Link>

      <ThreeScene />
    </main>
  );
}
