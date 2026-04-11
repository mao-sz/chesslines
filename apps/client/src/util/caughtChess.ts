import { Chess } from '@maoshizhong/chess';

export class CaughtChess extends Chess {
    invalid: boolean;

    constructor(...args: ConstructorParameters<typeof Chess>) {
        try {
            super(...args);
            this.invalid = false;
        } catch {
            // initialises standard starting board but will be "ignored" as validation will prevent loading board
            // super call necessary only due to rules of subclassing
            super();
            this.invalid = true;
        }
    }
}
