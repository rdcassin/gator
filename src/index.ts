import { setUser, readConfig } from "./config";

function main() {
    setUser("Doug");
    const cfg = readConfig();
    console.log(cfg);
}

main();