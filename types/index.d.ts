type Proxymise<T> = {
  [key in keyof T]: T[key] extends (
    ...args: infer Params
  ) => Promise<infer ReturnType>
    ? (...args: Params) => Proxymise<ReturnType>
    : T[key];
};

declare module "proxymise" {
  export default function <T>(target: T): Proxymise<T>;
}
