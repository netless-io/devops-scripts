export * from "./devOps";
export * from "./Docker";
export * from "./k8sCmd";
export * from "./shell";
export * from "./utils";

process.on("uncaughtException", error => {
    console.error("uncaughtException: ", error);
    process.exit(3);
});

process.on("unhandledRejection", error => {
    console.error("unhandledRejection: ", error);
    process.exit(4);
});