import * as shell from "./shell";
import path from "path";

export class Docker {
    private registry: string;
    private namespace: string;

    /**
     * 
     * @param config {registry 私有仓库， namespace 命名空间}
     */
    public constructor(config: {registry: string, namespace: string}) {
        this.registry = config.registry;
        this.namespace = config.namespace;
    }

    public imageName(name: string, tag: string) {
        return `${this.registry}/${this.namespace}/${name}:${tag}`;
    }
    
    public async build(dockerfile: string, name: string, tagName: string) {
        // TODO: support run script in different work path
        await shell.execInDir(path.dirname(dockerfile), `docker build --rm -f Dockerfile -t ${this.imageName(name, tagName)} .`);
    }
    
    public tag(name: string, originalTag: string, newTag: string) {
        shell.execSync(`docker tag ${this.imageName(name, originalTag)} ${this.imageName(name, newTag)}`);
    }
    
    public async push(name: string, tags: string | string[]) {
        if (typeof tags === "string") {
            tags = [tags];
        }
        for (const tag of tags) {
            await shell.exec(`docker push ${this.imageName(name, tag)}`);
        }
    }
    
    public async rmi(name: string, tags: string | string[]) {
        if (typeof tags === "string") {
            tags = [tags];
        }
        for (const tag of tags) {
            await shell.exec(`docker rmi ${this.imageName(name, tag)}`);
        }
    }

}