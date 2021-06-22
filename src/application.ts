import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, UserServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DbDataSource} from './datasources';
import {LoggerBindings, PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants, UserBindings} from './keys';
import {LoggerProvider} from './providers/logger.provider';
import {MySequence} from './sequence';
import {JWTService} from './services/jwt.service';
import {PasswordHasher} from './services/password.hasher';
import {MyUserService} from './services/user.service';



export {ApplicationConfig};

export class TrainingAppApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication)),
) {
    constructor(options: ApplicationConfig = {}) {
        super(options);

        // Set up the custom sequence
        this.sequence(MySequence);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));

        // Customize @loopback/rest-explorer configuration here
        this.configure(RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(RestExplorerComponent);
        this.component(AuthenticationComponent);
        // Mount jwt component
        this.component(JWTAuthenticationComponent);

        this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
        // this.bind(LoggerBindings.LOGGER).toProvider(LoggerProvider);
        this.setupBinding();
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };

    }
    setupBinding() {
        console.log("dtaa binding")
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(PasswordHasher);
        this.bind(PasswordHasherBindings.HASHING_ROUNDS).to(10);
        this.bind(UserBindings.USER_SERVICE).toClass(MyUserService);
        this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
        this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
        this.bind(TokenServiceBindings.TOKEN_EXPIRE_IN).to(TokenServiceConstants.TOKEN_EXPIRE_IN_VALUE);
        this.bind(LoggerBindings.LOGGER).toProvider(LoggerProvider);
    }
}
