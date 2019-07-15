/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("./util");
const cp = require("child_process");
function shouldSetupSettingsSearch() {
    const branch = process.env.BUILD_SOURCEBRANCH;
    return branch && (/\/master$/.test(branch) || branch.indexOf('/release/') >= 0);
}
exports.shouldSetupSettingsSearch = shouldSetupSettingsSearch;
function getSettingsSearchBuildId(packageJson) {
    try {
        const branch = process.env.BUILD_SOURCEBRANCH;
        if (typeof branch === 'undefined') {
            throw new Error('Missing BUILD_SOURCEBRANCH');
        }
        const branchId = branch.indexOf('/release/') >= 0 ? 0 :
            /\/master$/.test(branch) ? 1 :
                2; // Some unexpected branch
        const out = cp.execSync(`git rev-list HEAD --count`);
        const count = parseInt(out.toString());
        // <version number><commit count><branchId (avoid unlikely conflicts)>
        // 1.25.1, 1,234,567 commits, master = 1250112345671
        return util.versionStringToNumber(packageJson.version) * 1e8 + count * 10 + branchId;
    }
    catch (e) {
        throw new Error('Could not determine build number: ' + e.toString());
    }
}
exports.getSettingsSearchBuildId = getSettingsSearchBuildId;