import {Module} from "@nestjs/common";
import {GameGateway} from "./game.gateway";
import {GameQueue} from "./game.queue";

@Module({
	imports: [],
	providers: [GameGateway, GameQueue],
})

export class GameGatewayModule {
}