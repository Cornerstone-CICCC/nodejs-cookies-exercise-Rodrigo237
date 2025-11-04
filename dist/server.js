"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const page_routes_1 = __importDefault(require("./routes/page.routes"));
dotenv_1.default.config();
// Create server
const app = (0, express_1.default)();
//set view engine to EJS
app.set('view engine', 'EJS');
app.set('views', path_1.default.join(__dirname, '../src/views'));
// Middleware
app.use(express_1.default.json()); // Allow and parse JSON body
app.use(express_1.default.urlencoded({ extended: true })); // Allow form submission
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET_KEY)); // Enable signed cookies
// Routes
app.use('/', page_routes_1.default);
// Fallback
app.use((req, res, next) => {
    res.status(404).send("Invalid route!");
});
// Start server
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("Missing required port!");
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
