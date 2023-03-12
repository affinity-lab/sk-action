import AbstractActionResponse from "./abstract-action-response";
import type {AxiosResponse} from "axios";
import * as devalue from "devalue";

export default class ActionFatalErrorResponse extends AbstractActionResponse {
	readonly result: null = null;
	constructor(readonly response: AxiosResponse) {
		super();
		if (typeof response.data.data === "string") response.data.data = devalue.parse(response.data.data);
	}

	private cancelled = false;
	public stopPropagation() {this.cancelled = true;}
	get isCancelled(): boolean {return this.cancelled;}

	public get status(): number | undefined {return undefined}
	public get data(): Record<string, any> {return {}}
	public get location(): string | undefined { return undefined}
	public get error(): any {return undefined}
	public get type(): "success" | "failure" | "redirect" | "error" | "fatal-error" { return "fatal-error";}

	public onFatalError<T = any>(callback: (response: AxiosResponse) => void): this {
		callback(this.response);
		return this;
	}
}