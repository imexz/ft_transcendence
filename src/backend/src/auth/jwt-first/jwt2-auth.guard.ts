import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class Jwt2AuthGuard extends AuthGuard('jwttwo') {}