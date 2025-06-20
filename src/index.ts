import { setUser, readConfig } from "./config";

function main() {
    setUser("Doug");
    console.log(readConfig());
}

main();