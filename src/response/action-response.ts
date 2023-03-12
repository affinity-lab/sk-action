import AbstractActionResponse from "./abstract-action-response";
import type ActionResponseInterface from "./action-response-interface";
import type {ActionResult} from "@sveltejs/kit";
import type {AxiosResponse} from "axios";
import * as devalue from "devalue";

export default class ActionResponse extends AbstractActionResponse implements ActionResponseInterface {
	readonly result: ActionResult;
	constructor(readonly response: AxiosResponse) {
		super();
		if (typeof response.data.data === "string") response.data.data = devalue.parse(response.data.data);
		this.result = response.data as ActionResult;
	}

	public get status(): number | undefined {return this.result!.status}
	public get data(): Record<string, any> { return (this.result!.type === "success" || this.result!.type === "failure") && typeof this.result!.data !== "undefined" ? this.result!.data : {};}
	public get location(): string | undefined { return this.result.type === "redirect" ? this.result.location : undefined;}
	public get error(): any {return this.result!.type === "error" ? this.result!.error : undefined;}

	public onSuccess<T = Record<string, any> | undefined>(callback: (data: T, status: number) => void): this {
		if (this.result?.type === "success") callback(this.result.data as T, this.result.status);
		return this;
	}
	public onFailure<T = Record<string, any> | undefined>(status: number, callback: (data: T, status: number) => void): this;
	public onFailure<T = Record<string, any> | undefined>(callback: (data: T, status: number) => void): this;
	public onFailure<T = Record<string, any> | undefined>(p1: unknown, p2?: unknown): this {
		if (this.result?.type === "failure") {
			let status: number = -1;
			let callback: (data: T, status: number) => void;
			if (typeof p1 === "number") {
				status = p1;
				callback = p2 as (data: T, status: number) => void;
			} else {
				callback = p1 as (data: T, status: number) => void;
			}
			if (this.result?.status === status || status === -1) callback(this.result.data as T, this.result.status);
		}
		return this;
	}
	public onRedirect(callback: (location: string, status: number) => void): this {
		if (this.result?.type === "redirect") callback(this.result.location, this.result.status);
		return this;
	}
	public onError<T = any>(callback: (error: T, status?: number) => void): this {
		if (this.result?.type === "error") callback(this.result.error as T, this.result.status);
		return this;
	}
}