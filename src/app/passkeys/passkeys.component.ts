import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PasskeysService } from "../passkeys.service";

@Component({
  selector: "app-passkeys",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./passkeys.component.html",
  styleUrls: ["./passkeys.component.css"],
})
export class PasskeysComponent {
  email = "test@asso.fr";
  log = "";
  busy = false;

  constructor(private passkeys: PasskeysService) {}

  private append(msg: string) {
    this.log = `${this.log}\n${msg}`.trim();
  }

  async onRegister() {
    this.busy = true;
    try {
      this.append("REGISTER: start");
      const res = await this.passkeys.register(this.email);
      this.append("REGISTER: " + JSON.stringify(res, null, 2));
    } catch (e: any) {
      this.append("REGISTER ERROR: " + (e?.message || e));
    } finally {
      this.busy = false;
    }
  }

  async onLogin() {
    this.busy = true;
    try {
      this.append("LOGIN: start");
      const res = await this.passkeys.login(this.email);
      this.append("LOGIN: " + JSON.stringify(res, null, 2));
    } catch (e: any) {
      this.append("LOGIN ERROR: " + (e?.message || e));
    } finally {
      this.busy = false;
    }
  }
}
