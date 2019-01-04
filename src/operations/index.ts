
import _ from 'lodash';
import OperationBase from './lib/base';
import Join from './lib/ops/join';
import Selector from './lib/ops/selector';
import Extraction  from './lib/ops/extraction';
import Geolocation from './lib/validations/geolocation';
import String from './lib/validations/string';
import Number from './lib/validations/number';
import Boolean from './lib/validations/boolean';
import Url from './lib/validations/url';
import Email from './lib/validations/email';
import Ip from './lib/validations/ip';
import Base64Decode from './lib/ops/base64decode';
import UrlDecode from './lib/ops/urldecode';
import HexDecode from './lib/ops/hexdecode';
import RequiredExtractions from './lib/validations/required_extractions';

class CorePlugins {
    init() {
        return {
            join: Join,
            selector: Selector,
            extraction: Extraction,
            geolocation: Geolocation,
            string: String,
            boolean: Boolean,
            number: Number,
            url: Url,
            email: Email,
            ip: Ip,
            base64decode: Base64Decode,
            urldecode: UrlDecode,
            hexdecode: HexDecode,
            requiredExtractions: RequiredExtractions
        };
    }
}

// TODO: Fix me
interface Operations {
    [key: string]: Function;
}

class OperationsManager {
    operations: Operations;
    constructor(pluginList: object[] = []) {
        pluginList.push(CorePlugins);
        const operations = pluginList.reduce((plugins, PluginClass) => {
            // @ts-ignore
            const plugin = new PluginClass();
            const pluginOps = plugin.init();
            _.assign(plugins, pluginOps);
            return plugins;
        }, {});
        // @ts-ignore
        this.operations = operations;
    }

    getTransform(name: string): OperationBase {
        const op = this.operations[name];
        if (!op) throw new Error(`could not find transform module ${name}`);
        // TODO: fixme
        // @ts-ignore
        return op;
    }
}

export {
    OperationBase,
    Join,
    Selector,
    Extraction,
    Geolocation,
    String,
    Number,
    Boolean,
    Url,
    Email,
    Ip,
    Base64Decode,
    UrlDecode,
    HexDecode,
    RequiredExtractions,
    OperationsManager
};
