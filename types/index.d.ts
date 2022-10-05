declare module "proxymise" {
  export type Proxymise<T> = {
    [key in keyof T]: T[key] extends (
      ...args: infer Params
    ) => Promise<infer Return>
      ? (...args: Params) => Proxymise<Return>
      : T[key];
  } & Promise<T>;

  export default function <T>(target: T): Proxymise<T>;
}
