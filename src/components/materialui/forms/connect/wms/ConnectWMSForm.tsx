import * as React from 'react';
import AbstractForm, {AbstractFormProps} from "riux/lib/components/forms/abstract/AbstractForm";
import {Button, Grid, TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import ProxyProvider from "../../../../../utils/proxyprovider/ProxyProvider";
import {WMSCapabilities} from "@luciad/ria/model/capabilities/WMSCapabilities";
import {WMSCapabilitiesLayer} from "@luciad/ria/model/capabilities/WMSCapabilitiesLayer";
import ScreenMessage from "riux/lib/components/screenmessage/ScreenMessage";
import BasicTable from "../../commons/BasicTable";
import {Command, genereteUniqueID} from "riux/lib/reduxboilerplate/command/reducer";
import {ApplicationCommands} from "riux/lib/commands/ApplicationCommands";
import {LayerTypes} from "riux/lib/components/luciad/interfaces/LayerTypes";
import {Actions} from "riux/lib/reduxboilerplate/actions";
import {SendCommand} from "riux/lib/reduxboilerplate/command/actions";
import {connectForm} from "riux/lib/reduxboilerplate/connectForm";

interface State {
    url: string;
    getMapRoot: string;
    getFeatureInfoRoot: string;
    label: string;
    selectedLayers: WMSCapabilitiesLayer[];
    layers: WMSCapabilitiesLayer[];
    useProxy: boolean;
    format: string;
    formats: string[];
    featureInfo: string;
    featureInfoFormats: string[];
    rasterFormats: string[];
    crs: string;
    version: string;
    requestParameters: any;
    requestHeaders: any;
    metadata: any;
}

function WMSLayersTable(props: {rows: WMSCapabilitiesLayer[], onSelectionChanged: (arr: WMSCapabilitiesLayer[]) => void}) {
    const columns = ["title"]
    return <BasicTable columns={columns} rows={props.rows} dense={true} onSelectionChanged={props.onSelectionChanged}/>
}

interface DispatchProps {
    sendCommand: (command: Command) => void;
}

type Props = DispatchProps & AbstractFormProps;

class ConnectWMSForm extends AbstractForm<Props, State> {
    constructor(props: any) {
        super(props);
        this.setParentTitle('Connect to WMS');
        this.state = {
            url: "",
            getMapRoot: "",
            getFeatureInfoRoot: "",
            label: "",
            selectedLayers: [],
            layers: [],
            useProxy: false,
            format: '',
            formats: [],
            rasterFormats: [],
            featureInfo: 'json',
            featureInfoFormats: [],
            crs: '',
            version: '',
            requestParameters: undefined,
            requestHeaders: undefined,
            metadata: {},
        }
    }

    private resetState() {
        this.setState({
            label: "",
            layers: [],
            selectedLayers: [],
            useProxy: false,
            format: '',
            formats: [],
            rasterFormats: [],
            crs: '',
            version: '',
            requestParameters: undefined,
            metadata: {},
        });
    }

    private static prepareURL(url: string) {
        return url.trim();
    }

    protected isReadyToSubmit(): boolean {
        return this.state.selectedLayers.length > 0;
    }

    private static flattenWmsLayerHierarchy(
        layers: WMSCapabilitiesLayer[]
    ): WMSCapabilitiesLayer[]  {
        return layers.reduce(
            (accumulated: WMSCapabilitiesLayer[], value: WMSCapabilitiesLayer) => {
                accumulated.push(value);
                if (value.children) {
                    accumulated = accumulated.concat(
                        ConnectWMSForm.flattenWmsLayerHierarchy(value.children)
                    );
                }
                return accumulated;
            },
            []
        );
    }

    private static getBaseUrl(url: string) {
        let baseURL = url.trim();
        const index = baseURL.indexOf('?');
        if (index >= 0) {
            baseURL = url.substring(0, index);
        }
        return baseURL;
    }

    private getCapabilities = () => {
        this.resetState();
        const request = ConnectWMSForm.prepareURL(this.state.url);
        if (request !== '') {
            const MyProxy = ProxyProvider.HTTPProxy.generateProxy({
                useProxy: this.state.useProxy,
                indexes: { getcapabilities: request },
            });
            const options = { requestHeaders: MyProxy.headers };
            WMSCapabilities.fromURL(MyProxy.urls.getcapabilities, options).then(
                (result: WMSCapabilities) => {
                    if (result) {
                        const layers = ConnectWMSForm.flattenWmsLayerHierarchy(
                            result.layers
                        ).filter((q) => typeof q.name !== 'undefined');
                        const GetMap = result.operations.find((i) => i.name === 'GetMap');
                        const methodGet = (GetMap as any).supportedRequests.find(
                            (r: { method: string; url: string }) => r.method === 'GET'
                        );
                        const GetMapUrl = methodGet ? methodGet.url : this.state.url;
                        const GetFeatureInfo = result.operations.find(
                            (i) => i.name === 'GetFeatureInfo'
                        );
                        const methodGetFeatureInfo = (GetFeatureInfo as any).supportedRequests.find(
                            (r: { method: string; url: string }) => r.method === 'GET'
                        );
                        const GetFeatureInfoUrl = methodGetFeatureInfo
                            ? methodGetFeatureInfo.url
                            : this.state.url;
                        let defaultFormat = 'image/png';
                        if (GetMap) {
                            const format = GetMap.supportedFormats.find(
                                (f) => f.indexOf('png') > -1
                            );
                            defaultFormat = format ? format : defaultFormat;
                        }
                        this.setState(
                            {
                                url: ConnectWMSForm.getBaseUrl(this.state.url),
                                getMapRoot: ConnectWMSForm.getBaseUrl(GetMapUrl),
                                getFeatureInfoRoot: ConnectWMSForm.getBaseUrl(GetMapUrl),
                                requestParameters: {},
                                requestHeaders: options.requestHeaders,
                                featureInfo: 'json',
                                featureInfoFormats: GetFeatureInfo
                                    ? GetFeatureInfo.supportedFormats
                                    : [],
                                format: defaultFormat,
                                formats: GetMap ? GetMap.supportedFormats : [],
                                layers,
                                version: result.version,
                                metadata: {
                                    version: result.version,
                                    service: result.service,
                                },
                            }
                        );
                    }
                },
                () => {
                    ScreenMessage.error('Error accessing WMS entry point');
                }
            );
        }
    };

    layerSelectionChange = (selectedLayers: WMSCapabilitiesLayer[]) => {
        console.log(selectedLayers);
        const defaultCRS = 'CRS:84';
        const defaultFeatureFormat = 'application/json';
        const defaultRasterFormat = 'image/png';
        if (selectedLayers.length > 0) {
            const formats =
                this.state.formats && this.state.formats.length > 0
                    ? this.state.formats
                    : [defaultRasterFormat];
            let preferedFormat = formats.find((f) => f === defaultRasterFormat);
            preferedFormat = preferedFormat ? preferedFormat : formats[0];

            const currentLayer = selectedLayers[0];
            const references =
                currentLayer.supportedReferences &&
                currentLayer.supportedReferences.length > 0
                    ? currentLayer.supportedReferences
                    : [defaultCRS];
            let preferedCRS = references.find((f) => f === defaultCRS);
            preferedCRS = preferedCRS ? preferedCRS : references[0];

            const label = selectedLayers.map((l)=>l.title).join(", ");
            this.setState({
                selectedLayers,
                label,
                crs: preferedCRS,
                formats,
                format: preferedFormat,
            });
        } else {
            this.setState({
                selectedLayers,
                label: "",
                crs: "",
                formats: [],
                format: '',
            });
        }
    }

    render(): any {
        return (
            <form onSubmit={this.onSubmit} className="riux-material-ui-form">
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="url-id">Endpoint URL:</InputLabel>
                    <Input id="url-id" placeholder="Enter URL" value={this.state.url} name="url" onChange={this.handleChange} aria-describedby="url-helper-text" autoFocus={true}/>
                    <FormHelperText id="url-helper-text">{"Example: https://sampleservices.luciad.com/wms"}</FormHelperText>
                </FormControl>
                <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                    <Button color="primary" onClick={this.getCapabilities} disabled={!this.state.url}>Get Layers</Button>
                </Grid>
                    <WMSLayersTable rows={this.state.layers} onSelectionChanged={this.layerSelectionChange} />
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="label-id">Label:</InputLabel>
                    <Input id="label-id" placeholder="Enter desired layer name" value={this.state.label} name="label" onChange={this.handleChange}  />
                </FormControl>
                <div style={{float: "right", marginTop: 10, marginBottom: 15}}>
                    <Button onClick={this.closeParent} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={!this.isReadyToSubmit()}>
                        OK
                    </Button>
                </div>
            </form>
        );
    }

    protected onSubmit(event: React.SyntheticEvent) {
        super.onSubmit(event);
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.CREATEANYLAYER,
            parameters: {
                "layerType": LayerTypes.WMSLayer,
                "model": {
                    "layers": this.state.selectedLayers.map(l => l.name),
                    "imageFormat": this.state.format,
                    "getMapRoot": this.state.getMapRoot,
                    "getFeatureInfoFormat": this.state.featureInfo,
                    "getFeatureInfoRoot": this.state.getFeatureInfoRoot,
                    "reference": this.state.crs,
                    "transparent": true,
                    "useDefaultProjection": false,
                    "version": this.state.version,
                    "useProxy": this.state.useProxy,
                    "requestHeaders": this.state.requestHeaders,
                    "requestParameters": this.state.requestParameters
                },
                "layer": {
                    "label": this.state.label,
                    "visible": true
                },
                "autozoom": true
            },

        }
        this.props.sendCommand(command);
    }
}

function mapStateToProps(state: unknown): unknown {
    return {};
}

function mapDispatchToProps(dispatch: React.Dispatch<Actions>): DispatchProps {
    return {
        sendCommand: (command: Command) => {
            dispatch(SendCommand(command))
        }
    };
}

export default connectForm<unknown, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps
)(ConnectWMSForm);

