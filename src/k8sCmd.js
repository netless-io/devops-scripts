function apply(yaml) {
    return `kubectl apply -f ${yaml}`;
}

function patchInfo() {
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

function patch(namespace, deployment, patchInfo) {
    namespace = namespace ? namespace : "default";
    return `kubectl patch deployment ${deployment} -n ${namespace} --patch '${patchInfo}'`;
}

module.exports = {apply, patch, patchInfo};