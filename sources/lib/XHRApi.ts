export class XHRApi {
	private xhr: XMLHttpRequest;

	public request(method: string, url: string, data: string, callback: (response: string)=>void): void {
		this.xhr = new XMLHttpRequest();
		this.xhr.open(method, url);
		this.xhr.onreadystatechange = ()=> {
			if (this.xhr.readyState == this.xhr.DONE) {
				callback(this.xhr.response);
			}
		}
		this.xhr.setRequestHeader('Content-Type', 'application/json');
		this.xhr.send(data);
	}
	public get(url: string, callback: (response: string)=>void): void {
		this.request('GET', url, null, callback);
	}
	public post(url: string, data: object, callback: (response: string)=>void): void {
		this.request('POST', url, JSON.stringify(data), callback);
	}
}

export const xhr = new XHRApi();
