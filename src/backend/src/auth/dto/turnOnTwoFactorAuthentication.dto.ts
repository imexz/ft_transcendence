import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
 
export class TwoFactorAuthenticationCodeDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  twoFactorAuthenticationCode: string;
}
 
export default TwoFactorAuthenticationCodeDto;