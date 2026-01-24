"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDecimal = toDecimal;
const library_1 = require("@prisma/client/runtime/library");
function toDecimal(value) {
    return new library_1.Decimal(value);
}
//# sourceMappingURL=decimal.util.js.map