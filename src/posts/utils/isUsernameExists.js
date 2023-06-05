import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";

export default async function isUsernameExists(displayName) {
  const q = query(collection(db, "users"), where("displayName", "==", displayName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size > 0;
}
