import { ServiceRegistry } from './service.registry';
import { ExistingServiceException } from './exception/existing.service.exception';
import { NonExistingServiceException } from './exception/non-existing.service.exception';

describe('ServiceRegistry', () => {
    let registry: ServiceRegistry<unknown>;

    beforeEach(() => {
        registry = new ServiceRegistry();
    });

    describe('all', () => {
        it('should return an empty object when no services are registered', () => {
            expect(registry.all()).toEqual({});
        });

        it('should return all registered services', () => {
            registry.register('service1', { name: 'Service 1' });
            registry.register('service2', { name: 'Service 2' });

            expect(registry.all()).toEqual({
                service1: { name: 'Service 1' },
                service2: { name: 'Service 2' },
            });
        });

        it('should return a copy of the services object, not a reference', () => {
            registry.register('service1', { name: 'Service 1' });

            const services = registry.all();
            services.service1 = { name: 'Modified Service' };

            expect(registry.get('service1')).toEqual({ name: 'Service 1' });
        });
    });

    describe('register', () => {
        it('should register a new service', () => {
            registry.register('service1', { name: 'Service 1' });

            expect(registry.get('service1')).toEqual({ name: 'Service 1' });
        });

        it('should throw an error when registering an existing service', () => {
            registry.register('service1', { name: 'Service 1' });

            expect(() => registry.register('service1', { name: 'Service 1' })).toThrow(ExistingServiceException);
        });
    });

    describe('unregister', () => {
        it('should unregister an existing service', () => {
            registry.register('service1', { name: 'Service 1' });
            registry.unregister('service1');

            expect(() => registry.get('service1')).toThrow(NonExistingServiceException);
        });

        it('should throw an error when unregistering a non-existing service', () => {
            expect(() => registry.unregister('service1')).toThrow(NonExistingServiceException);
        });
    });

    describe('has', () => {
        it('should return true if the service is registered', () => {
            registry.register('service1', { name: 'Service 1' });

            expect(registry.has('service1')).toBe(true);
        });

        it('should return false if the service is not registered', () => {
            expect(registry.has('service1')).toBe(false);
        });
    });

    describe('get', () => {
        it('should return the registered service', () => {
            registry.register('service1', { name: 'Service 1' });

            expect(registry.get('service1')).toEqual({ name: 'Service 1' });
        });

        it('should throw an error if the service is not registered', () => {
            expect(() => registry.get('service1')).toThrow(NonExistingServiceException);
        });
    });
});