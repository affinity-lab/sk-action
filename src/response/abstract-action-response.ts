import type ActionResponseInterface from "./action-response-interface";
import type {ActionResult} from "@sveltejs/kit";
import type {AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders} from "axios";

export default abstract class AbstractActionResponse implements ActionResponseInterface {
	public readonly result: ActionResult | null = null;

	public get http(): {
		readonly headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
		readonly text: string;
		readonly status: number
	} {
		let response = this.response;
		return {
			get status(): number {return response.status},
			get text(): string {return response.statusText},
			get headers(): RawAxiosResponseHeaders | AxiosResponseHeaders {return response.headers}
		}
	}

	public get type(): "success" | "failure" | "redirect" | "error" | "fatal-error" { return this.result!.type;}
	public get isSuccess(): boolean {return this.type === "success";}
	public get isFailure(): boolean {return this.type === "failure";}
	public get isRedirect(): boolean {return this.type === "redirect";}
	public get isError(): boolean {return this.type === "error";}
	public get isFatalError(): boolean {return this.type === "fatal-error";}


	public readonly abstract data: Record<string, any>;
	public readonly abstract error: any;
	public readonly abstract location: string | undefined;
	public readonly abstract response: AxiosResponse;
	public readonly abstract status: number | undefined;


	public onError<T = any>(callback: (error: T, status?: number) => void): this { return this; }
	public onFailure<T = Record<string, any> | undefined>(p1: unknown, p2?: unknown): this { return this; }
	public onRedirect(callback: (location: string, status: number) => void): this { return this; }
	public onSuccess<T = Record<string, any> | undefined>(callback: (data: T, status: number) => void): this { return this; }
	public onFatalError<T = any>(callback: (response: AxiosResponse) => void): this { return this; }
}