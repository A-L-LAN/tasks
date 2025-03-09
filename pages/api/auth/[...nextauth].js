import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../database";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        return new Promise((resolve, reject) => {
          db.get("SELECT * FROM users WHERE username = ?", [credentials.username], async (err, user) => {
            if (err || !user) {
              return reject(new Error("Invalid credentials"));
            }

            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) {
              return reject(new Error("Invalid credentials"));
            }

            resolve({ id: user.id, username: user.username });
          });
        });
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  },
  secret: "your-secret-key",
});
