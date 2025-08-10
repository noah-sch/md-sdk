import type { MarkdownConfig } from "../types";
import { DEFAULT_CONFIG } from "./defaults";

export class ConfigLoader {
    private config: MarkdownConfig = DEFAULT_CONFIG;

    async loadConfig(configFilePath?: string): Promise<MarkdownConfig>{
        if (!configFilePath) {
            return this.config;
        }
        
        try {
            const responseConfig = await fetch(configFilePath);
            if (!responseConfig.ok) {
                return this.config;
            }

            const customConfig = await responseConfig.json();
            this.config = this.mergeConfigs(DEFAULT_CONFIG, customConfig);

            return this.config;
        } catch (error) {
            return this.config;
        }
    }

    private mergeConfigs(defaultConfig: MarkdownConfig, customConfig: Partial<MarkdownConfig>): MarkdownConfig {
        return {
            theme: customConfig.theme || defaultConfig.theme, 
            styles: {
                ...defaultConfig.styles,
                ...customConfig.styles,
                heading: {
                    ...defaultConfig.styles.heading,
                    ...customConfig.styles?.heading,
                }
            }
        };
    }

    getConfig(): MarkdownConfig {
        return this.config;
    }
}