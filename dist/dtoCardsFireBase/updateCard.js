"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCardDto = void 0;
const createCard_1 = require("./createCard");
const mapped_types_1 = require("@nestjs/mapped-types");
class UpdateCardDto extends (0, mapped_types_1.PartialType)(createCard_1.CreateCard) {
}
exports.UpdateCardDto = UpdateCardDto;
//# sourceMappingURL=updateCard.js.map