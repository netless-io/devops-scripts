import * as shell from "../utils/shell";
import path from "path";
import { DockerRegistry } from "../config";

export class Docker {
    private registry: DockerRegistry
    
    public constructor(config: DockerRegistry) {
        this.registry = config;
    }

    /**
     * 
     * @param docker 构建出来带 registry，namespace 的镜像地址
     * @param dockerfile dockerfile 路径，如果是相对路径，应该以 node 执行位置为准
     * @param imageName 镜像名
     * @param tags 镜像 tag，可以为 string，单个 tag，或者多个 tag 名称
     * @param deleteAfter push 完后，是否删除本地镜像
     */
    public async buildAndPush(dockerfile: string, imageName: string, tags: string | string[], deleteAfter: boolean): Promise<void> {
        if (typeof tags === "string") {
            tags = [tags];
        }

        await this.build(dockerfile, imageName, tags[0]);
        tags.filter(t => t !== tags[0]).map(t => {
            this.tag(imageName, tags[0], t);
        });
        await this.push(imageName, tags);
        if (deleteAfter) {
            await this.rmImage(imageName, tags);
        }
    }

    public imageName(name: string, tag: string) {
        return `${this.registry.auth}/${this.registry.namespace}/${name}:${tag}`;
    }
    
    public async build(dockerfile: string, name: string, tagName: string) {
        // TODO: support run script in different work path
        await shell.execInDir(path.dirname(dockerfile), `docker build --rm -f ${path.basename(dockerfile)} -t ${this.imageName(name, tagName)} .`);
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

    public async rmImage(name: string, tags: string | string[]) {
        if (typeof tags === "string") {
            tags = [tags];
        }
        for (const tag of tags) {
            await shell.exec(`docker rmi ${this.imageName(name, tag)}`);
        }
    }
}