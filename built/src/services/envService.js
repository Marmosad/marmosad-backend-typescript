"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var EnvService = /** @class */ (function () {
    function EnvService() {
        this._prodMode = false;
        this.loaded = false;
        console.log('Fetching Env Config.');
        var args = process.argv;
        var params = args.filter(function (x) {
            return x.substr(0, 2) === '--';
        }).map(function (x) {
            var param = x.split(/--|=/).filter(function (y) {
                return !!y;
            });
            return { 'name': param[0] ? param[0] : null, 'arg': param[1] ? param[1] : null };
        });
        var prodMode = params.filter(function (x) {
            return x.name === 'env' && x.arg === 'production';
        }).length;
        this._prodMode = !!prodMode;
        if (prodMode) {
            this.loadEnvProduction();
        }
        else {
            this.loadEnvDevelopment();
        }
    }
    Object.defineProperty(EnvService.prototype, "prodMode", {
        get: function () {
            return this._prodMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnvService.prototype, "env", {
        get: function () {
            return this._env;
        },
        enumerable: true,
        configurable: true
    });
    EnvService.prototype.loadEnvDevelopment = function () {
        require('dotenv').config({ path: '.env.development' });
        this._env = process.env;
    };
    EnvService.prototype.loadEnvProduction = function () {
        require('dotenv').config({ path: '.env.production' });
        this._env = process.env;
    };
    EnvService = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], EnvService);
    return EnvService;
}());
exports.EnvService = EnvService;
