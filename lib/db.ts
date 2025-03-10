import { drizzle } from "drizzle-orm/postgres-js";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import dotenv from "dotenv";
import axios from "axios";
import xml2js from "xml2js";
import crypto from "crypto";
import { EncryptedConnection, DecryptedConnection } from "./definition";

dotenv.config();

const key: string = process.env.ENCRYPTION_KEY as string;
const iv: string = process.env.ENCRYPTION_IV as string;
const server = process.env.SERVER;

function decrypt(text: string) {
  const keyBuffer: unknown = Buffer.from(key, "utf-8");
  const ivBuffer: unknown = Buffer.from(iv, "utf-8");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    keyBuffer as crypto.CipherKey,
    ivBuffer as crypto.BinaryLike
  );
  decipher.setAutoPadding(false);

  let decryptedData = decipher.update(text, "base64", "utf8");
  decryptedData += decipher.final("utf8");

  return decryptedData;
}

export default async function getConnectionDetails(branch: string) {
  let connection: DecryptedConnection = {
    ORA_IP: "",
    ORA_SERVICENAME: "",
    ORA_USER: "",
    ORA_PWD: "",
    ORA_KODEIGR: "",
  };
  let url = "";

  url =
    "http://172.31.16.32/ORAWS/OracleWebService.asmx/GetConnectionPGDetail" +
    "?KodeIGR=" +
    branch +
    "&Server=" +
    server;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/xml",
      },
      responseType: "text",
    });

    xml2js.parseString(
      response.data,
      { explicitArray: false },
      (err: Error | null, result: EncryptedConnection) => {
        if (err) {
          throw err;
        }

        connection = {
          ORA_IP: decrypt(result.ORA.CONNECTION.ORA_IP).trim(),
          ORA_SERVICENAME: decrypt(
            result.ORA.CONNECTION.ORA_SERVICENAME
          ).trim(),
          ORA_USER: decrypt(result.ORA.CONNECTION.ORA_USER).trim(),
          ORA_PWD: decrypt(result.ORA.CONNECTION.ORA_PWD).trim(),
          ORA_KODEIGR: result.ORA.CONNECTION.ORA_KODEIGR.trim(),
        };
      }
    );

    return connection;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}
export type User = {
  id: string;
  name: string;
  password: string;
};

async function getURL(branch: string) {
  const connection = await getConnectionDetails(branch);
  const url = `postgres://${connection?.ORA_USER}:${connection?.ORA_PWD}@${connection?.ORA_IP}:5432/${connection?.ORA_SERVICENAME}`;
  return url;
}

export async function getUser(id: string, password: string) {
  const users = await usersTable();
  const url = await getURL("44");
  const client = postgres(url);
  const db = drizzle(client);

  const result = await db
    .select()
    .from(users)
    .where((users) => eq(users.id, id) && eq(users.password, password))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0] as User;
}

async function usersTable() {
  const table = pgTable("tbmaster_user", {
    id: varchar("userid").primaryKey(),
    name: varchar("userid"),
    password: varchar("userpassword"),
  });

  return table;
}
