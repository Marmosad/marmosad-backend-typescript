class EnvService {
    private _env: any;
    private _prodMode = false;

    constructor() {
        console.log('loading env variables');
        console.log(process.argv)
        const args = process.argv;
        const params = args.filter((x) => {
            return x.substr(0, 2) === '--';
        }).map((x) => {
            const param = x.split(/--|=/).filter((y) => {
                return !!y;
            });
            return {'name': param[0] ? param[0] : null, 'arg': param[1] ? param[1] : null};
        })
        const prodMode = params.filter((x) => {
            return x.name === 'env' && x.arg === 'production';
        }).length;
        this._prodMode = !!prodMode;
        
        if(prodMode) {
            this.loadEnvProduction();
        } else {
            this.loadEnvDevelopment();
        }

    }

    get prodMode() {
        return this._prodMode;
    }

    get env() {
        return this._env;
    }
    
    private loadEnvDevelopment() {
        require('dotenv').config({path: '.env.development'});
        this._env = process.env;
    }

    private loadEnvProduction() {
        require('dotenv').config({path: '.env.production'});
        this._env = process.env;
    }
}

const envService = new EnvService();
export default envService;