import { Component } from "@angular/core";
import { PasskeysComponent } from "./passkeys/passkeys.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [PasskeysComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {}

