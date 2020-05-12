import { Container } from "inversify";
import CountRepository from "@repository/count-repository";
import WhitelistService from "@service/whitelist-service";
import FormsRepository from "@repository/forms-repository";
import LowRepository from "@repository/low-repository";
import DiscordService from "./service/discord-service";
import RpRepository from "./repository/rp-repository";

const container = new Container();
container.bind<LowRepository>(LowRepository).toSelf();
container.bind<RpRepository>(RpRepository).toSelf();
container.bind<CountRepository>(CountRepository).toSelf();
container.bind<FormsRepository>(FormsRepository).toSelf();
container.bind<WhitelistService>(WhitelistService).toSelf();
container.bind<DiscordService>(DiscordService).toSelf();

export { container };