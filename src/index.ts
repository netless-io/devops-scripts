export * from "./git";
export * from "./deploy";
export * from "./config";
export * from "./utils";

process.on("uncaughtException", error => {
    console.error("uncaughtException: ", error);
    process.exit(3);
});

process.on("unhandledRejection", error => {
    console.error("unhandledRejection: ", error);
    process.exit(4);
});