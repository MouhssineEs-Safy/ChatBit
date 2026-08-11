import * as repo from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { signToken } from "../../utils/jwt.js";
import { HttpError } from "../../utils/httpError.js";

const VALID_ROLES = ["client", "agent"];

export async function register({ fullname, email, password, role }) {
  // 1. validation → 400
  if (!fullname || !email || !password) {
    throw new HttpError(400, "fullname, email and password are required", "BAD_REQUEST");
  }
  if (password.length < 6) {
    throw new HttpError(400, "password must be at least 6 characters", "BAD_REQUEST");
  }
  if (!VALID_ROLES.includes(role)) {
    throw new HttpError(400, "role must be 'client' or 'agent'", "BAD_REQUEST");
  }

  // 2. unique email → 409
  const existing = await repo.findByEmail(email);
  if (existing) {
    throw new HttpError(409, "Email already used", "CONFLICT");
  }

  // 3. hash + create
  const passwordhash = await hashPassword(password);
  const user = await repo.createUser({ fullname, email, passwordhash, role });

  // 4. token
  const token = signToken({ id: user.id, role: user.role });
  return { token, user };
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new HttpError(400, "email and password are required", "BAD_REQUEST");
  }

  const user = await repo.findByEmail(email);
  if (!user) {
    throw new HttpError(401, "Invalid credentials", "UNAUTHORIZED");
  }

  const ok = await comparePassword(password, user.passwordhash);
  if (!ok) {
    throw new HttpError(401, "Invalid credentials", "UNAUTHORIZED");
  }

  const token = signToken({ id: user.id, role: user.role });
  // strip passwordhash before returning
  const { passwordhash, ...safeUser } = user;
  return { token, user: safeUser };
}
