export type DockerRegistry = {
    /** reference: ~/.docker/config.json */
    auth: string;
    namespace: string;
}

export type SSHConfig = {
    host: string;
    dir?: string;
}