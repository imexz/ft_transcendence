import { Settings } from "./gameSettings";
import User from "./user";

export default class GameRequest {
  user: User
  settings: Settings
  response: any
}