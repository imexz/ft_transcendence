import { Dependencies, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// import { Strategy } from "passport-42"
import { Strategy } from "passport"


@Injectable()
export class LocalAuthGuard extends AuthGuard("42") {}
