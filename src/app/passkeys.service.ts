import { Injectable } from "@angular/core";

type RegisterStartResponse = {
  challenge: string;
  rp: { name: string; id: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: Array<{ type: "public-key"; alg: number }>;
  timeout: number;
};

type LoginStartResponse = {
  challenge: string;
  allowCredentials: Array<{ type: "public-key"; id: string }>;
  timeout: number;
};

@Injectable({ providedIn: "root" })
export class PasskeysService {
  private jsonHeaders = { "Content-Type": "application/json" };

  private b64uToBuf(b64u: string): ArrayBuffer {
    const base64 = b64u.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (base64.length % 4)) % 4);
    const bin = atob(base64 + pad);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  private bufToB64u(buf: ArrayBuffer): string {
    const bytes = new Uint8Array(buf);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  private async postJson<T>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: this.jsonHeaders,
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    return data as T;
  }

  async register(email: string): Promise<any> {
    // 1) backend -> options
    const options = await this.postJson<RegisterStartResponse>("/webauthn/register/start", { email });

    // 2) prepare PublicKeyCredentialCreationOptions
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: this.b64uToBuf(options.challenge),
      rp: options.rp,
      user: {
        id: this.b64uToBuf(options.user.id),
        name: options.user.name,
        displayName: options.user.displayName,
      },
      pubKeyCredParams: options.pubKeyCredParams,
      timeout: options.timeout,
    };

    // 3) browser creates passkey
    const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential;

    const att = cred.response as AuthenticatorAttestationResponse;

    // 4) send credential to backend
    const payload = {
      email,
      credential: {
        id: cred.id,
        rawId: this.bufToB64u(cred.rawId),
        type: cred.type,
        response: {
          clientDataJSON: this.bufToB64u(att.clientDataJSON),
          attestationObject: this.bufToB64u(att.attestationObject),
        },
      },
    };

    return await this.postJson<any>("/webauthn/register/finish", payload);
  }

  async login(email: string): Promise<any> {
    // 1) backend -> options
    const options = await this.postJson<LoginStartResponse>("/webauthn/login/start", { email });

    // 2) prepare PublicKeyCredentialRequestOptions
    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: this.b64uToBuf(options.challenge),
      allowCredentials: options.allowCredentials.map((c) => ({
        type: "public-key",
        id: this.b64uToBuf(c.id),
      })),
      timeout: options.timeout,
    };

    // 3) browser uses passkey
    const cred = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;
    const auth = cred.response as AuthenticatorAssertionResponse;

    // 4) send proof to backend
    const payload = {
      email,
      credential: {
        id: cred.id,
        rawId: this.bufToB64u(cred.rawId),
        type: cred.type,
        response: {
          clientDataJSON: this.bufToB64u(auth.clientDataJSON),
          authenticatorData: this.bufToB64u(auth.authenticatorData),
          signature: this.bufToB64u(auth.signature),
          userHandle: auth.userHandle ? this.bufToB64u(auth.userHandle) : null,
        },
      },
    };

    return await this.postJson<any>("/webauthn/login/finish", payload);
  }
}
