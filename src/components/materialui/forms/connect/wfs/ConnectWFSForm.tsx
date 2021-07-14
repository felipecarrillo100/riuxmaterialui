import * as React from 'react';
import AbstractForm, {AbstractFormProps} from "riux/lib/components/forms/abstract/AbstractForm";
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import {Actions} from "riux/lib/reduxboilerplate/actions";
import {Command} from "riux/lib/reduxboilerplate/command/reducer";
import {SendCommand} from "riux/lib/reduxboilerplate/command/actions";
import {connectForm} from "riux/lib/reduxboilerplate/connectForm";

interface DispatchProps {
    sendCommand: (command: Command) => void;
}

type Props = DispatchProps & AbstractFormProps;

interface State {
    url: string;
    label: string;
    layer: string;
    crs: string;
    version: string;
}

class ConnectWFSForm extends AbstractForm<Props, State> {
    constructor(props: any) {
        super(props);
        this.setParentTitle('Connect to WFS');
        this.state = {
            url: '',
            label: "",
            layer: "",
            crs: '',
            version: '',
        }
    }

    render(): any {
        return (
            <form onSubmit={this.onSubmit} style={{width: 400, maxWidth:"100%"}}>
                <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid container>
                        <Grid item sm={12}>
                            <TextField label="Base Url" value={this.state.url} name="url" onChange={this.handleChange} fullWidth={true}  />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={8} />
                        <Grid item sm={4}>
                            <Button variant="outlined"  color="secondary" fullWidth={true} >Get layers</Button>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={12}>
                            <FormControl fullWidth={true} >
                                <InputLabel id="available-layers-label">Available layers</InputLabel>
                                <Select
                                    labelId="available-layers-label"
                                    value={this.state.layer}
                                    name="layer"
                                    onChange={this.handleChange}
                                >
                                    <MenuItem value={"diez"}>Ten</MenuItem>
                                    <MenuItem value={"veinte"}>Twenty</MenuItem>
                                    <MenuItem value={"treinta"}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={12}>
                            <TextField label="Label" value={this.state.label} name="label" onChange={this.handleChange} fullWidth={true}  />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={12}>
                            <FormControl fullWidth={true} >
                                <InputLabel id="available-formats-label">Available formats</InputLabel>
                                <Select
                                    labelId="available-formats-label"
                                    value={this.state.layer}
                                    name="layer"
                                    onChange={this.handleChange}
                                >
                                    <MenuItem value={"diez"}>Ten</MenuItem>
                                    <MenuItem value={"veinte"}>Twenty</MenuItem>
                                    <MenuItem value={"treinta"}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item sm={6}>
                            <TextField label="CRS" value={this.state.crs} name="crs" onChange={this.handleChange} fullWidth={true}  />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField label="WFS Version" value={this.state.version} name="version" onChange={this.handleChange} fullWidth={true}  />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item sm={6}>
                            <TextField  label="Loading strategy" value={this.state.label} name="label" onChange={this.handleChange} fullWidth={true}  />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField label="Max Features" value={this.state.label} name="label" onChange={this.handleChange} fullWidth={true}  />
                        </Grid>
                    </Grid>
                </Grid>
                <div style={{float: "right", marginTop: 10, marginBottom: 15}}>
                    <Button onClick={this.closeParent} variant="outlined"  color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="outlined" color="primary" disabled={!this.isReadyToSubmit()}>
                        OK
                    </Button>
                </div>
            </form>
        );
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
)(ConnectWFSForm);

