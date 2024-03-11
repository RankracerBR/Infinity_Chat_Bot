export declare function getReleaseInfo(): Promise<{
    llamaCpp: {
        binarySource: string;
        release: string;
    };
    moduleVersion: string;
}>;
