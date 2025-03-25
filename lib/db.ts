import { drizzle } from "drizzle-orm/postgres-js";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import dotenv from "dotenv";
import axios from "axios";
import xml2js from "xml2js";
import crypto from "crypto";
import { EncryptedConnection, DecryptedConnection } from "./definition";
// import os from "os";
// import oracledb from "oracledb";
// oracledb.initOracleClient({ libDir: "C:\\instantclient_21_9" });

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

// function getLocalIPSegment(): string | null {
//   const interfaces = os.networkInterfaces();

//   for (const key in interfaces) {
//     for (const net of interfaces[key] || []) {
//       // Ambil hanya IPv4 yang bukan loopback
//       if (net.family === "IPv4" && !net.internal) {
//         const segments = net.address.split(".");
//         if (segments.length >= 3) {
//           const ipSegment = `${segments[0]}.${segments[1]}.${segments[2]}`;
//           return ipSegment;
//         }
//       }
//     }
//   }

//   console.warn("Tidak dapat menemukan IP lokal!");
//   return null;
// }

// async function getBranchCodeByIPSegment(
//   ipSegment: string
// ): Promise<string | null> {
//   let connection;

//   try {
//     const oracleUser = process.env.ORACLE_USER as string;
//     const oraclePassword = process.env.ORACLE_PASSWORD as string;
//     const oracleHost = process.env.ORACLE_HOST as string;
//     const oraclePort = process.env.ORACLE_PORT as string;
//     const oracleService = process.env.ORACLE_SERVICE as string;
//     const connectString = `${oracleHost}:${oraclePort}/${oracleService}`;

//     connection = await oracledb.getConnection({
//       user: oracleUser,
//       password: oraclePassword,
//       connectString: connectString,
//     });

//     const query = `
//       SELECT branch_code
//       FROM sarana_listip_igr
//       WHERE host = :ipSegment
//       FETCH FIRST 1 ROWS ONLY
//     `;

//     // ✅ Tambahkan outFormat untuk mengembalikan objek dengan nama kolom
//     const result = await connection.execute<{ branch_code: string }>(
//       query,
//       { ipSegment },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     if (!result.rows || result.rows.length === 0) {
//       console.warn(`Branch code not found for IP segment: ${ipSegment}`);
//       return null;
//     }
//     const branchCode = result.rows[0].branch_code;
//     console.log(`Match found! Returning branch code: ${branchCode}`);

//     return branchCode;
//   } catch (error) {
//     console.error("Error fetching branch data from Oracle:", error);
//     return null;
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (closeError) {
//         console.error("Error closing Oracle connection:", closeError);
//       }
//     }
//   }
// }

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
  // const localIPSegment = getLocalIPSegment();
  // if (!localIPSegment) {
  //   console.error("Gagal mendapatkan IP lokal.");
  //   return null;
  // }
  // console.log("Local IP Segment:", localIPSegment);

  // const branch = await getBranchCodeByIPSegment(localIPSegment);
  // if (!branch) {
  //   console.error(
  //     `Branch code tidak ditemukan untuk IP segment: ${localIPSegment}`
  //   );
  //   return null;
  // }

  // console.log("Branch Code:", branch);

  // const url = await getURL(branch);
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
