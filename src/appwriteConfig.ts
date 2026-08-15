import { Client, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6a7591e30013e05c28bc");

export const databases = new Databases(client);

export const DATABASE_ID = "6a78bc41001ccba21fd3";
export const LOGENTRIES_TABLE_ID = "log_entries";