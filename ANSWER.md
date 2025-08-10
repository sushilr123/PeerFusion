# PeerFusion Homework – Step-by-Step Answers

This guide solves every task in `homework.md` with clear steps, rationale, and sample code. Use it as a reference while implementing or reviewing your project.

Note: The repo already contains many of these pieces. Treat the snippets as canonical patterns you can compare with your implementation.

---

## 1) Repository and Node/Express Setup

- Create a repository and initialize git

  - mkdir PeerFusion; git init; create .gitignore
  - Recommended .gitignore: `node_modules/`, `.env`, `dist/`, `.DS_Store`

- Files to expect

  - package.json, package-lock.json (auto-generated), node_modules (installed deps)

- Install express and basic server

  - Dependencies: express, dotenv, cors, cookie-parser, morgan (optional)

- Script setup (example)

```json
// package.json (scripts)
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

- Create `src/app.js` (minimal server)

```js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => res.send("OK"));
app.get("/hello", (req, res) => res.json({ message: "Hello World" }));

app.listen(7777, () => console.log("Server running on 7777"));
```

- Nodemon

  - Install nodemon (as dev): start with `npm run dev` for auto-reload

- What are dependencies?

  - Runtime libs your code imports; stored under `dependencies`

- What is `-g` while npm install?

  - Installs packages globally, not recommended for app runtime deps

- Caret vs tilde
  - `^1.2.3` allows minor+patch upgrades; `~1.2.3` allows patch upgrades only

---

## 2) Routing Basics and Order

- Play with routes and extensions

  - Example order matters: more specific routes before generic patterns

- Example of route order and regex routes

```js
app.get("/hello", handler); // exact
app.get("/hello/:id", handlerById); // dynamic
app.get(/^\/.*fly$/, handlerRegex); // regex e.g., /butterfly
```

- Reading query params and dynamic routes

```js
app.get("/search", (req, res) => {
  const { q, page = 1 } = req.query;
  res.json({ q, page: Number(page) });
});

app.get("/users/:userId", (req, res) => {
  res.json({ userId: req.params.userId });
});
```

- HTTP verbs and Postman
  - Implement handlers for GET, POST, PATCH, DELETE and verify via Postman

---

## 3) Middleware, next(), and Error Handling

- Multiple Route Handlers and next()

```js
const logStart = (req, res, next) => {
  console.log("start");
  next();
};
const handler = (req, res) => res.send("done");
app.get("/multi", logStart, handler);
```

- Difference `app.use` vs `app.all`

  - `app.use(path, mw)` applies to all methods under a path; `app.all(path, h)` handles all HTTP methods for a specific path

- Dummy admin/user auth middleware

```js
const adminOnly = (req, res, next) => {
  if (req.headers["x-role"] === "admin") return next();
  return res.status(403).json({ message: "Admins only" });
};
```

- Centralized error handler

```js
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});
```

---

## 4) MongoDB Atlas, Mongoose, and DB Connection

- Create Atlas cluster and connection string

  - Example: `mongodb+srv://<user>:<pass>@cluster/peerfusion`

- Connect before starting server (src/config/database.js)

```js
import mongoose from "mongoose";

export const connectDB = async (uri) => {
  await mongoose.connect(uri, { dbName: "peerfusion" });
  console.log("MongoDB connected");
};
```

- In `src/app.js`

```js
import { connectDB } from "./config/database.js";
import dotenv from "dotenv";
dotenv.config();
await connectDB(process.env.DATABASE_URL);
app.listen(process.env.PORT || 7777);
```

- Create userSchema & User model (src/models/user.js)

```js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    bio: { type: String, trim: true, maxlength: 400 },
    skills: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const User = mongoose.model("User", userSchema);
```

---

## 5) Signup/Login APIs, JSON, and Validation

- Add `express.json()` in app (already shown)

- Dynamic Signup API (POST /signup)

```js
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";

const signupValidators = [
  body("firstName").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword(),
  body("gender").isIn(["male", "female", "other"]),
];

app.post("/signup", signupValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const user = await User.create(req.body);
  res.status(201).json({ user: { id: user._id, email: user.email } });
});
```

- Get user by email (GET /user?email=...)

```js
app.get("/user", async (req, res) => {
  const user = await User.findOne({ email: req.query.email }).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({ user });
});
```

- Feed API (GET /feed)

```js
app.get("/feed", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  const users = await User.find({}, { password: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
  res.json({ page, limit, users });
});
```

- Get user by ID

```js
app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id, { password: 0 }).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({ user });
});
```

- Delete user

```js
app.delete("/user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

- PATCH vs PUT

  - PATCH: partial update; PUT: replace full resource (idempotent)

- Update user (PATCH /user/:id)

```js
app.patch("/user/:id", async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true, projection: { password: 0 } }
  );
  res.json({ user });
});
```

- findOneAndUpdate options

  - `new`, `runValidators`, `upsert`, `projection`, `context: 'query'`

- Update user by email

```js
app.patch("/user", async (req, res) => {
  const { email, ...updates } = req.body;
  const user = await User.findOneAndUpdate(
    { email },
    { $set: updates },
    { new: true, runValidators: true, projection: { password: 0 } }
  );
  res.json({ user });
});
```

---

## 6) SchemaType Options, API Validation, and Sanitizing

- SchemaType options examples used above: `required`, `unique`, `lowercase`, `trim`, `minlength`, `maxlength`, `default`.

- Custom validate example (gender handled by enum). Example for skills:

```js
skills: {
  type: [String],
  validate: v => Array.isArray(v) && v.length <= 20
}
```

- API-level validation using `express-validator` shown earlier; sanitize/normalize inputs and never trust `req.body`.

- Use `validator` library in utils for email/password/URL validation if needed.

---

## 7) Auth: bcrypt, Login, Cookies, JWT, userAuth

- Create login API

```js
import jwt from "jsonwebtoken";

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = user.getJWT(); // 7 days expiry configured in model
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production over HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res.cookie("token", token, cookieOptions).json({ success: true });
});
```

- Dummy cookie test and profile API reading cookie

```js
app.get("/set-cookie", (req, res) => {
  res.cookie("demo", "1", { httpOnly: true }).send("cookie set");
});

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/profile", userAuth, async (req, res) => {
  const user = await User.findById(req.user.id, { password: 0 }).lean();
  res.json({ user });
});
```

- Set expiry of JWT and cookie to 7 days
  - Done via `getJWT({ expiresIn: '7d' })` and cookie `maxAge` as above

---

## 8) Networking APIs, Routers, and Grouping

- Potential API list (high-level)

  - Auth: signup, login, logout, me, refresh (optional)
  - Profile: get profile, edit profile, change password
  - Users: feed, search, get by id
  - Requests: send, review (accept/reject/cancel), list sent/received, connections
  - Chat: conversations, messages CRUD, read receipts
  - Payments: create order, verify, status

- Group multiple routes under routers

```js
import express from "express";
export const authRouter = express.Router();
export const profileRouter = express.Router();
export const requestRouter = express.Router();
```

- Mount in `app.js`

```js
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { requestRouter } from "./routes/request.js";

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
```

- Auth routes examples

```js
authRouter.post(
  "/signup",
  /* validators */ async (req, res) => {
    /* ... */
  }
);
authRouter.post("/login", async (req, res) => {
  /* ... */
});
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token").json({ success: true });
});
```

- Profile routes

```js
profileRouter.get("/", userAuth, async (req, res) => {
  /* ... */
});
profileRouter.patch("/edit", userAuth, async (req, res) => {
  /* validate and update */
});
profileRouter.patch("/password", userAuth, async (req, res) => {
  /* current/new password */
});
```

---

## 9) ConnectionRequest Schema and APIs

- Schema (src/models/connectionRequest.js)

```js
import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
```

- Send Connection Request API

```js
requestRouter.post("/send/:userId", userAuth, async (req, res) => {
  const sender = req.user.id;
  const receiver = req.params.userId;
  if (sender === receiver)
    return res.status(400).json({ message: "Self request not allowed" });

  // Prevent duplicates or reverse duplicates
  const exists = await ConnectionRequest.findOne({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  });
  if (exists)
    return res
      .status(409)
      .json({ message: "Request already exists between users" });

  const doc = await ConnectionRequest.create({ sender, receiver });
  res.status(201).json({ request: doc });
});
```

- Corner cases to handle

  - Self request, duplicate (both directions), already accepted users, blocked users (if supported)

- `$or` / `$and` queries used above; pre-save hooks can normalize or audit

- Indexes
  - Unique compound on (sender, receiver) to prevent duplicates
  - Pros: fast lookups, integrity; Cons: write overhead, storage

---

## 10) Review Request, Populate, and Lists

- Review API (Accept/Reject/Cancel)

```js
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  const { status, requestId } = req.params;
  if (!["accepted", "rejected", "cancelled"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const reqDoc = await ConnectionRequest.findOneAndUpdate(
    { _id: requestId, receiver: req.user.id, status: "pending" },
    { $set: { status } },
    { new: true }
  );
  if (!reqDoc)
    return res
      .status(404)
      .json({ message: "Request not found or not pending" });

  res.json({ request: reqDoc });
});
```

- Populate examples

```js
requestRouter.get("/received", userAuth, async (req, res) => {
  const list = await ConnectionRequest.find({
    receiver: req.user.id,
    status: "pending",
  })
    .populate("sender", "firstName lastName skills")
    .lean();
  res.json({ requests: list });
});

requestRouter.get("/connections", userAuth, async (req, res) => {
  const connected = await ConnectionRequest.find({
    $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    status: "accepted",
  })
    .populate("sender receiver", "firstName lastName skills")
    .lean();
  res.json({ connections: connected });
});
```

---

## 11) Feed Logic, Operators, and Pagination

- Exclude users already connected or pending requests

```js
profileRouter.get("/feed", userAuth, async (req, res) => {
  const me = req.user.id;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const edges = await ConnectionRequest.find({
    $or: [{ sender: me }, { receiver: me }],
  })
    .select("sender receiver status")
    .lean();

  const excluded = new Set([me]);
  edges.forEach((e) => {
    excluded.add(String(e.sender));
    excluded.add(String(e.receiver));
  });

  const users = await User.find(
    { _id: { $nin: Array.from(excluded) } },
    { password: 0 }
  )
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({ page, limit, users });
});
```

- Operators used: `$nin`, `$or`, `$and`, `$ne` as needed for filtering

- Pagination Formula
  - skip = (page - 1) \* limit
  - Example:
    - page=1, limit=10 -> skip 0
    - page=2, limit=10 -> skip 10

---

## 12) Password Change and Logout

- PATCH /profile/password (forgot/reset pattern if token-based) or change with current password

```js
profileRouter.patch("/password", userAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const ok = await user.comparePassword(currentPassword);
  if (!ok)
    return res.status(400).json({ message: "Current password incorrect" });
  user.password = newPassword; // hashed by pre-save
  await user.save();
  res.json({ success: true });
});
```

- POST /logout

```js
authRouter.post("/logout", (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, sameSite: "lax" })
    .json({ success: true });
});
```

---

## 13) Additional Best Practices

- Data projections to avoid sending sensitive fields: `{ password: 0 }`
- Use `lean()` for read-only queries to improve performance
- Index frequent query fields (email, participants)
- Add rate-limits for auth and payment endpoints
- Use HTTPS in production; set `secure: true` on cookies

---

## 14) Pagination Notes (from homework.md)

- /feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
- /feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
- /feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)
- /feed?page=4&limit=10 => 31-40 => .skip(30) & .limit(10)

Formula: `skip = (page - 1) * limit`

---

## 15) Checklist Mapping (Quick Reference)

- Repo setup: init, .gitignore, push to GitHub
- Express server: routes for /test, /hello; nodemon
- HTTP methods: GET, POST, PATCH, DELETE; regex routes
- Middleware: dummy admin/user; `next()`; error handler
- MongoDB & Mongoose: connect before listen; user schema/model
- Signup/Login: JSON middleware; validator; bcrypt; error handling
- Cookies & JWT: cookie-parser; JWT in httpOnly cookie (7d)
- userAuth middleware: protect /profile and requests
- Routers: authRouter, profileRouter, requestRouter; mount in app.js
- APIs: logout, profile edit, password change with validation
- ConnectionRequest model: unique pair index
- Request APIs: send, review; lists with populate
- Feed API: exclude existing edges; pagination; operators
- Indexes: understand pros/cons and compound index usage

You can copy any snippet into your codebase if missing, but most of these patterns already exist in PeerFusion.
