# Changelog

## v1.5.1

This is a hotfix to resolve issues with loading PenguinMod Desktop while offline.\
The issue was caused by an error when the app could not check for updates.

### Fixed

-   You can now once again use the app when offline

## v1.5.0

Updated to latest version of PenguinMod and added a splash screen

### Added

-   Added a splash screen, which will show while PenguinMod Desktop loads
-   Added deep links, check the [readme](/README.md) for further details

### Changed

-   Updated to latest version of PenguinMod as of the `24th of December 2025`

## v1.4.4

Updated to latest version of PenguinMod and some other changes.

### Changed

-   Updated to latest version of PenguinMod as of the `23rd of October 2025`

## v1.4.3

Updated to latest version of PenguinMod and some other changes.

### Changed

-   Updated to latest version of PenguinMod as of the `8th of September 2025`

## v1.4.2

Updated to latest version of PenguinMod and some other changes.

### Changed

-   Updated to latest version of PenguinMod as of the `3rd of August 2025`

## v1.4.1

Updated to latest version of PenguinMod and some other changes.

### Changed

-   Updated to latest version of PenguinMod as of the `2nd of August 2025`

## v1.4.0

Updated to latest version of PenguinMod and some other changes.

### Added

-   There is now a `Desktop Settings` category under the settings tab
-   Added a livetests toggle under `Desktop Settings`

### Changed

-   Updated to latest version of PenguinMod as of the `19th of July 2025`
-   Updated the `Webview Windows` extension, which has been moved to livetests

## v1.3.0

Updated to latest version of PenguinMod and added a new extension.

### Added

-   There is now a `Webview Windows` extension, which will receive more features in future updates
    -   This will only work with PenguinMod Desktop, and will not work in packaged projects or PenguinMod

### Changed

-   Updated to latest version of PenguinMod as of the `11th of May 2025`

## v1.2.1

Fixed an issue with loading extensions.

### Fixed

-   Fixed loading extensions using `data:` or `file:` protocols while offline

## v1.2.0

The app should now auto update.

### Added

-   The app now has an automatic updater

## v1.1.0

If you previously loaded an extension while online, you will now be able to use it while offline.

### Added

-   Added an extension cache

### Changed

-   Changed how logs are handled internally

## v1.0.1

Added logs and fixed addons.

### Added

-   Logs are now stored in the appdata folder
    -   For Windows: `%localappdata%/com.penguinmod.app/logs`
    -   For MacOS: `~/Library/Logs/com.penguinmod.app`
    -   For Linux: `~/.local/share/com.penguinmod.app/logs`

### Fixed

-   The addon button now correctly opens the addon page

## v1.0.0

Initial release
