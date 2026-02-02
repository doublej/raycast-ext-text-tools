/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** AI Model - Claude model for the AI unwrap command */
  "model": "claude-3-haiku-20240307" | "claude-3-5-haiku-20241022" | "claude-haiku-4-5-20250414"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `clean-watermark` command */
  export type CleanWatermark = ExtensionPreferences & {}
  /** Preferences accessible in the `unwrap-text` command */
  export type UnwrapText = ExtensionPreferences & {}
  /** Preferences accessible in the `unwrap-ai` command */
  export type UnwrapAi = ExtensionPreferences & {}
  /** Preferences accessible in the `wrap-clipboard` command */
  export type WrapClipboard = ExtensionPreferences & {}
  /** Preferences accessible in the `wrap-selection` command */
  export type WrapSelection = ExtensionPreferences & {}
  /** Preferences accessible in the `text-transformer` command */
  export type TextTransformer = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `clean-watermark` command */
  export type CleanWatermark = {}
  /** Arguments passed to the `unwrap-text` command */
  export type UnwrapText = {}
  /** Arguments passed to the `unwrap-ai` command */
  export type UnwrapAi = {}
  /** Arguments passed to the `wrap-clipboard` command */
  export type WrapClipboard = {
  /** Tag name */
  "tag": string
}
  /** Arguments passed to the `wrap-selection` command */
  export type WrapSelection = {
  /** Tag name */
  "tag": string
}
  /** Arguments passed to the `text-transformer` command */
  export type TextTransformer = {}
}

