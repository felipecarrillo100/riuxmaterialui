import * as React from 'react';
import AbstractForm, {AbstractFormProps} from "riux/lib/components/forms/abstract/AbstractForm";
import {Command, genereteUniqueID} from "riux/lib/reduxboilerplate/command/reducer";
import {ApplicationCommands} from "riux/lib/commands/ApplicationCommands";
import {LayerTypes} from "riux/lib/components/luciad/interfaces/LayerTypes";
import {Actions} from "riux/lib/reduxboilerplate/actions";
import {SendCommand} from "riux/lib/reduxboilerplate/command/actions";
import {connectForm} from "riux/lib/reduxboilerplate/connectForm";
import {Button, Grid, TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";

interface DispatchProps {
    sendCommand: (command: Command) => void;
}

type Props = DispatchProps & AbstractFormProps;

interface State {
    url: string;
    label: string;
    subdomains: string;
    levels: number;
}

function getHostName(url: string): string {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    }
    else {
        return "";
    }
}

class ConnectTMSForm extends AbstractForm<Props, State> {
    constructor(props: any) {
        super(props);
        this.setParentTitle('Connect to TMS');
        this.state = {
            url: "",
            label: "",
            subdomains: "a,b,c",
            levels: 21,
        }
    }

    protected isReadyToSubmit(): boolean {
        return super.isReadyToSubmit() && this.state.label.length > 0 && this.state.url.length > 0;
    }

    protected onSubmit(event: React.SyntheticEvent) {
        super.onSubmit(event);
        const command: Command = {
            uid: genereteUniqueID(),
            action: ApplicationCommands.CREATEANYLAYER,
            parameters: {
                "layerType": LayerTypes.TMSLayer,
                "model": {
                    baseURL: this.state.url,
                    levelCount: Number(this.state.levels),
                    subdomains: this.state.subdomains.replace(/\s+/g, '').split(',')
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

    render(): any {
        return (
            <form onSubmit={this.onSubmit} style={{width: 480, maxWidth:"100%"}}>
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="url-id">Endpoint URL:</InputLabel>
                    <Input id="url-id" placeholder="Enter URL" value={this.state.url} name="url" onChange={this.handleChange} aria-describedby="url-helper-text" autoFocus={true}/>
                    <FormHelperText id="url-helper-text">{"Example: https://{s}.tile.openstreetmap.org/{z}/{x}/{-y}.png"}</FormHelperText>
                </FormControl>
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="label-id">Label:</InputLabel>
                    <Input id="label-id" placeholder="Enter desired layer name" value={this.state.label} name="label" onChange={this.handleChange}  />
                </FormControl>
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="subdomains-id">Subdomains:</InputLabel>
                    <Input id="subdomains-id" placeholder="Enter subdomains"  value={this.state.subdomains} name="subdomains" onChange={this.handleChange}  />
                </FormControl>
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="levels-id">Levels:</InputLabel>
                    <Input id="levels-id" placeholder="Enter maximum number of zoom level" value={this.state.levels} name="levels" onChange={this.handleChange}  />
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

    public handleChange (event:any) {
        const { name, value } = event.target;
        const realValue = event.target.type === 'checkbox' ? event.target.checked : value;

        let shortName = this.state.label;
        if (name==="url"){
            shortName = getHostName(realValue).replace("{s}.", "");
            this.setState({["url"]: realValue, ["label"]: shortName });
        } else {
            // @ts-ignore
            this.setState({[name]: realValue});
        }
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
)(ConnectTMSForm);
