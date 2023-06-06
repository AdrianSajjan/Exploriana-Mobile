import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export async function connectToSQLiteDatabase(): Promise<SQLite.WebSQLDatabase> {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
  }
  await FileSystem.downloadAsync(Asset.fromModule(require("../../assets/database/database.db")).uri, FileSystem.documentDirectory + "SQLite/main.db");
  return SQLite.openDatabase("main.db");
}
