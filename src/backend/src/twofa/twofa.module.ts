import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
// import { UsersService } from "src/users/users.service";
import { TwoFactorAuthenticationController } from "./twofa.controller";
import { TwofaService } from "./twofa.service";


@Module({
    imports: [forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
    providers: [TwofaService] ,
    controllers: [TwoFactorAuthenticationController],
    exports: [TwofaService],
})
export class TwofsModule {}