"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const PAGE_SIZE = 4096;
const executeCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        (0, child_process_1.exec)(command, (_, stdout) => {
            return resolve(stdout);
        });
    });
});
const physicalMemory = () => __awaiter(void 0, void 0, void 0, function* () {
    const commandResponse = yield executeCommand('sysctl -n hw.memsize');
    return Number(String(commandResponse));
});
const fetchVmStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const commandResponse = (yield executeCommand('vm_stat'))
        .split('\n').filter((x, i) => x !== '' && i > 0);
    return commandResponse.map(v => v.split(':').map(v => v.trim().replace('.', ''))).reduce((prev, curr) => (Object.assign(Object.assign({}, prev), { [curr[0]]: Number(curr[1]) })), {});
});
const currentUsedMemory = () => __awaiter(void 0, void 0, void 0, function* () {
    const vmStats = yield fetchVmStats();
    const usedMemoryPages = (vmStats['Anonymous pages'] - vmStats['Pages purgeable']) + vmStats['Pages wired down'] + vmStats['Pages occupied by compressor'];
    return usedMemoryPages * PAGE_SIZE;
});
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield physicalMemory();
    const used = yield currentUsedMemory();
    return {
        usedPercent: used / total * 100,
        used,
        total,
    };
});
