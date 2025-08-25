"use client";
import { useState } from "react";
import List from "@/components/List";
import { Vinyl } from "@/utils/Definitions";
import Form from "@/components/form/Form";

function Page() {
  const [editing, setEditing] = useState<Vinyl | null>(null);

  return (
    <>
      <Form
        initialData={editing || undefined}
        onSuccess={() => setEditing(null)}
      />
      <List onEdit={setEditing} />
    </>
  );
}

export default Page;
