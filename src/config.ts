import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(username: string): Config {
  const currentConfig = readConfig();
  const updatedConfig: Config = {
    dbUrl: currentConfig.dbUrl,
    currentUserName: username,
  };
  writeConfig(updatedConfig);
  return updatedConfig;
}

export function readConfig(): Config {
  const filePath: string = getConfigFilePath();
  const rawConfig: string = fs.readFileSync(filePath, "utf-8");
  const parsedConfig: any = JSON.parse(rawConfig);
  const validConfig: Config = validateConfig(parsedConfig);
  return validConfig;
}

function getConfigFilePath(): string {
    const homePath: string = os.homedir();
    const configFileName: string = ".gatorconfig.json";
    return path.join(homePath, configFileName);
}

function validateConfig(parsedConfig: any): Config {
  if (parsedConfig.db_url) {
    return {
      dbUrl: parsedConfig.db_url,
      currentUserName: parsedConfig.current_user_name ?? "",
    };
  } else {
    throw new Error("invalid configuration");
  }
}

function writeConfig(cfg: Config): void {
    const filePath: string = getConfigFilePath();
    const jsonObj = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    };
    const jsonString = JSON.stringify(jsonObj);
    fs.writeFileSync(filePath, jsonString);
}