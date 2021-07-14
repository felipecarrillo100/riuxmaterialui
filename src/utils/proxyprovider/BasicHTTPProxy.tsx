
class BasicHTTPProxy {
    private static ProxyToken: string = "";
    private static proxyIndex: number = 0;
    private static ProxyUrl: string = "";

    setToken(token: string) {
        BasicHTTPProxy.ProxyToken = token;
    }

    public static generateProxy = (options: {
        indexes: { [key: string]: string };
        useProxy?: boolean;
        requestHeaders?: { [key: string]: string };
    }) => {
        const Indexes = { ...options.indexes };
        Object.keys(Indexes).map((key, index) => {
            Indexes[key] = Indexes[key].trim().split('?')[0];
        });
        const useProxy =
            typeof options.useProxy !== 'undefined' ? options.useProxy : false;
        const myProxySettings = {
            Auth: BasicHTTPProxy.ProxyToken,
            Indexes,
        };
        const token = btoa(JSON.stringify(myProxySettings));
        const headers = options.requestHeaders ? { ...options.requestHeaders } : {};

        const urls = { ...options.indexes };
        Object.keys(urls).map((key, index) => {
            urls[key] = urls[key].trim();
        });
        if (useProxy) {
            const Accept = 'token=' + token;
            headers.Accept = headers.Accept ? Accept + ';' + headers.Accept : Accept;

            BasicHTTPProxy.proxyIndex++;
            Object.keys(urls).map((key, index) => {
                const uuid = BasicHTTPProxy.proxyIndex + '_' + Date.now();
                const urlParts = urls[key].split('?');
                const queryStr = urlParts.length > 1 ? '?' + urlParts[1] : '';
                urls[key] = BasicHTTPProxy.ProxyUrl + 'uid_' + uuid + '/' + key + queryStr;
            });
        }
        return {
            headers,
            urls,
        };
    }
}

export default BasicHTTPProxy
