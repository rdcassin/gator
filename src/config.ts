import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(username: string) {
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
}

function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required and needs to be a string");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name ?? "",
  };
}

export function readConfig() {
  const filePath = getConfigFilePath();
  const data = fs.readFileSync(filePath, "utf-8");
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

function getConfigFilePath() {
  const homePath = os.homedir();
  const configFileName = ".gatorconfig.json";
  return path.join(homePath, configFileName);
}

function writeConfig(cfg: Config) {
  const filePath = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const data = JSON.stringify(rawConfig);
  fs.writeFileSync(filePath, data, { encoding: "utf-8" });
}
