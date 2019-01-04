
import { PhaseManager } from '../dist';
import { debugLogger, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from '../src/interfaces';

const logger = debugLogger('ts-transform');

export default class TestHarness {
    // @ts-ignore
    private phaseManager: PhaseManager;

    async init (config: WatcherConfig, plugins?: object) {
        this.phaseManager = new PhaseManager(config, logger);
        await this.phaseManager.init(plugins);
        return this;
    }
    run(data: DataEntity[]) {
        return this.phaseManager.run(data);
    }
}
