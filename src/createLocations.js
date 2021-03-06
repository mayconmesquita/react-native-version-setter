import {constants} from './constants.js'

/**
 * Create the location objects for find and replace.
 * @param version
 * @param packageJson
 * @param platform
 * @param config
 * @returns Array
 */
export const createLocations = (version, packageJson, platform = null, config) => {

    const iosProjectName = config.iosProjectName || packageJson.name

    const allLocations = [
        {
            files: './android/app/build.gradle',
            from: [
                new RegExp('versionCode [0-9]+', 'g'),
                new RegExp('versionName "([0-9, .])+([-+][a-z0-9]+)?"')
            ],
            to: [
                `versionCode ${version.code}`,
                `versionName "${version.raw}"`
            ],
            platform: constants.platform.android
        },
        {
            files: `./ios/${iosProjectName}.xcodeproj/project.pbxproj`,
            from: new RegExp('MARKETING_VERSION = [0-9, .]+', 'g'),
            to: `MARKETING_VERSION = ${version.core}`,
            platform: constants.platform.ios
        },
        {
            files: `./package.json`,
            from: new RegExp('"version": ".+"'),
            to: `"version": "${version.raw}"`,
            platform: constants.platform.universal
        },
    ]

    /**
     * If a platform was passed, find the locations for that platform.
     */
    switch (platform) {

        case constants.platform.android:
            return allLocations.filter(location => location.platform === constants.platform.android)

        case constants.platform.ios:
            return allLocations.filter(location => location.platform === constants.platform.ios)

        case constants.platform.universal:
        default:
            return allLocations
    }

}
