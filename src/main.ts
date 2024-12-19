import { doGet } from "./doGet";

// GASから参照したい変数はglobalオブジェクトに渡してあげる必要がある
(global as any).doGet = doGet;
