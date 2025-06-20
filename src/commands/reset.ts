import { resetUsers } from "src/lib/db/queries/users";

export async function handlerReset() {
  await resetUsers();
  console.log("deleted all users");
}
