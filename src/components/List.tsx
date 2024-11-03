import { getVinyls } from "@/services/vinyls";

export default async function List() {
  const vinyls = await getVinyls();
  return (
    <ol style={{ paddingLeft: "50px" }}>
      {vinyls.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ol>
  );
}
