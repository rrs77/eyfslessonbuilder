import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sql } from './db';

// Credentials provider - always available (works in dev and prod)
// Email provider can be added later when email is configured
const providers = [
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
    },
    async authorize(credentials) {
      if (!credentials?.email) return null;
      const email = credentials.email as string;
      
      try {
        // Find or create user
        let user = await sql.query(
          `SELECT * FROM users WHERE email = $1`,
          [email]
        );
        
        if (user.rows.length === 0) {
          // Create user
          const result = await sql.query(
            `INSERT INTO users (id, email, email_verified, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, true, now(), now())
             RETURNING *`,
            [email]
          );
          return {
            id: result.rows[0].id,
            email: result.rows[0].email,
          };
        }
        
        return {
          id: user.rows[0].id,
          email: user.rows[0].email,
        };
      } catch (error: any) {
        console.error('Auth error:', error);
        // If database connection fails, throw a more helpful error
        if (error.code === 'ECONNREFUSED' || error.message?.includes('connection') || error.message?.includes('POSTGRES_URL')) {
          throw new Error('Database not connected. Please start PostgreSQL and run migrations. See README for setup instructions.');
        }
        return null;
      }
    },
  })
];

// Adapter with error handling
const adapter = {
  async createUser(user: any) {
    try {
      const result = await sql.query(
        `INSERT INTO users (id, email, email_verified, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, now(), now())
         RETURNING *`,
        [user.email, user.emailVerified || false]
      );
      return {
        id: result.rows[0].id,
        email: result.rows[0].email,
        emailVerified: result.rows[0].email_verified,
      };
    } catch (error: any) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  },
  async getUser(id: string) {
    try {
      const result = await sql.query(`SELECT * FROM users WHERE id = $1`, [id]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        emailVerified: row.email_verified,
      };
    } catch (error: any) {
      console.error('Database error in getUser:', error);
      return null;
    }
  },
  async getUserByEmail(email: string) {
    try {
      const result = await sql.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        emailVerified: row.email_verified,
      };
    } catch (error: any) {
      console.error('Database error in getUserByEmail:', error);
      return null;
    }
  },
  async getUserByAccount({ providerAccountId, provider }: any) {
    try {
      const result = await sql.query(
        `SELECT u.* FROM users u
         JOIN accounts a ON u.id = a.user_id
         WHERE a.provider = $1 AND a.provider_account_id = $2`,
        [provider, providerAccountId]
      );
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        emailVerified: row.email_verified,
      };
    } catch (error: any) {
      console.error('Database error in getUserByAccount:', error);
      return null;
    }
  },
  async updateUser(user: any) {
    try {
      const result = await sql.query(
        `UPDATE users SET email = $1, email_verified = $2, updated_at = now()
         WHERE id = $3
         RETURNING *`,
        [user.email, user.emailVerified || false, user.id]
      );
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        emailVerified: row.email_verified,
      };
    } catch (error: any) {
      console.error('Database error in updateUser:', error);
      throw error;
    }
  },
  async linkAccount(account: any) {
    try {
      await sql.query(
        `INSERT INTO accounts (
          id, user_id, type, provider, provider_account_id,
          refresh_token, access_token, expires_at, token_type,
          scope, id_token, session_state, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4,
          $5, $6, $7, $8, $9, $10, $11, now(), now()
        )`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at ? new Date(account.expires_at * 1000) : null,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state,
        ]
      );
      return account;
    } catch (error: any) {
      console.error('Database error in linkAccount:', error);
      throw error;
    }
  },
  async createSession({ sessionToken, userId, expires }: any) {
    try {
      const result = await sql.query(
        `INSERT INTO sessions (id, session_token, user_id, expires, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, now(), now())
         RETURNING *`,
        [sessionToken, userId, expires]
      );
      const row = result.rows[0];
      return {
        sessionToken: row.session_token,
        userId: row.user_id,
        expires: row.expires,
      };
    } catch (error: any) {
      console.error('Database error in createSession:', error);
      throw error;
    }
  },
  async getSessionAndUser(sessionToken: string) {
    try {
      const result = await sql.query(
        `SELECT s.*, u.* FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.session_token = $1 AND s.expires > now()`,
        [sessionToken]
      );
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        session: {
          sessionToken: row.session_token,
          userId: row.user_id,
          expires: row.expires,
        },
        user: {
          id: row.id,
          email: row.email,
          emailVerified: row.email_verified,
        },
      };
    } catch (error: any) {
      console.error('Database error in getSessionAndUser:', error);
      return null;
    }
  },
  async updateSession({ sessionToken, expires }: any) {
    try {
      const result = await sql.query(
        `UPDATE sessions SET expires = $1, updated_at = now()
         WHERE session_token = $2
         RETURNING *`,
        [expires, sessionToken]
      );
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        sessionToken: row.session_token,
        userId: row.user_id,
        expires: row.expires,
      };
    } catch (error: any) {
      console.error('Database error in updateSession:', error);
      return null;
    }
  },
  async deleteSession(sessionToken: string) {
    try {
      await sql.query(`DELETE FROM sessions WHERE session_token = $1`, [sessionToken]);
    } catch (error: any) {
      console.error('Database error in deleteSession:', error);
      // Ignore errors for delete
    }
  },
  async createVerificationToken({ identifier, expires, token }: any) {
    try {
      const result = await sql.query(
        `INSERT INTO verification_tokens (identifier, token, expires, created_at)
         VALUES ($1, $2, $3, now())
         RETURNING *`,
        [identifier, token, expires]
      );
      const row = result.rows[0];
      return {
        identifier: row.identifier,
        token: row.token,
        expires: row.expires,
      };
    } catch (error: any) {
      console.error('Database error in createVerificationToken:', error);
      throw error;
    }
  },
  async useVerificationToken({ identifier, token }: any) {
    try {
      const result = await sql.query(
        `DELETE FROM verification_tokens
         WHERE identifier = $1 AND token = $2
         RETURNING *`,
        [identifier, token]
      );
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        identifier: row.identifier,
        token: row.token,
        expires: row.expires,
      };
    } catch (error: any) {
      console.error('Database error in useVerificationToken:', error);
      return null;
    }
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  adapter,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth }) {
      return !!auth;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt', // Required for Credentials provider
  },
});
