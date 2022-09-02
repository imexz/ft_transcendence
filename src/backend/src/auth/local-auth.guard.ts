import { Injectable } from "@nestjs/common";
import { AuthGuard } from "passport-42";

@Injectable()
export class LocalAuthGuard extends AuthGuard('42') {}