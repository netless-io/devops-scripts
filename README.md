## docker-scripts

构建私有仓库的 docker image 以及 k8s 部署的命令。

涉及 docker 时，需要传入 docker Registry 信息：

```ts
docker tag IMAGE[:TAG] [REGISTRY_HOST[:REGISTRY_PORT]/]REPOSITORY[:TAG]
```

## Docker

```ts
/ *
  * @param config {registry 私有仓库，例如：example.com， namespace 命名空间，例如：dev}
  */
const docker = new Docker({registry: "registry", namespace: "命名空间"});
```

会执行对应的 docker 命令

```ts
export declare class Docker {
    private registry;
    private namespace;
    /**
     *
     * @param config {registry 私有仓库， namespace 命名空间}
     */
    constructor(config: {
        registry: string;
        namespace: string;
    });
    imageName(name: string, tag: string): string;
    build(dockerfile: string, name: string, tagName: string): Promise<void>;
    tag(name: string, originalTag: string, newTag: string): void;
    push(name: string, tags: string | string[]): Promise<void>;
    rmi(name: string, tags: string | string[]): Promise<void>;
}
```

## devOps

build push docker，以及执行 k8s 命令。

```ts
export declare function buildAndPush(docker: Docker, dockerfile: string, name: string, tags: string | string[], deleteAfter: boolean): Promise<void>;
export declare function deployK8s(dir: string, yml: string, deployment: string, namespace: string): Promise<void>;
```

## k8sCmd

返回 k8s 命令的文本内容。

```ts
export declare function apply(yaml: string): string;
export declare function patchInfo(): string;
export declare function patch(namespace: string | undefined, deployment: string, patchInfo: string): string;
```

## shell

通过 nodejs 的 child_process 模块，调用 shell 脚本。

```ts
export declare function execSyncInDir(dir: string, command: string): string;
export declare function execSync(command: string): string;
export declare function execInDir(dir: string, command: string): Promise<string>;
export declare function exec(command: string): Promise<string>;
export declare function execRemote(address: string, commands: string[] | any): Promise<string>;
```

## version

构建时需要的一些版本记录快捷方法。

```ts
export declare function gitHash(): string;
export declare function packageContent(path: string): any;
```