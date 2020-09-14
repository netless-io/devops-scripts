export function apply(yaml: string): string {
    return `kubectl apply -f ${yaml}`;
}

export function patchInfo(): string {
    return JSON.stringify({
        "spec": {
            "template": {
                "metadata": {
                    "annotations": {
                        "version/config": `${Date.now()}`,
                    },
                },
            },
        },
    });
}

export function patch(namespace: string | undefined, deployment: string, patchInfo: string): string {
    namespace = namespace ? namespace : "default";
    return `kubectl patch deployment ${deployment} -n ${namespace} --patch '${patchInfo}'`;
}