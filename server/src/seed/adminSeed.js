import bcrypt from "bcryptjs";
import { query } from "../db/index.js";

const seedAdmin = async () => {
  const adminEmail = "admin@pass4sure.com";
  const adminPassword = "Admin@123";

  const existing = await query("select id from users where email = $1", [adminEmail]);
  if (existing.rowCount > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await query(
    "insert into users (id, name, email, password_hash, role) values (gen_random_uuid(), $1, $2, $3, $4)",
    ["Super Admin", adminEmail, passwordHash, "admin"]
  );
};

export default seedAdmin;
